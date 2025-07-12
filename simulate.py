import random
from abc import ABC, abstractmethod
import statistics
from typing import Dict
import math
from enum import Enum
import pandas

class Stat(Enum):
  POINTS = "Points"
  ROLLS_DONE = "Rolls Done",
  INITIAL_DICE = "Initial Dice",
  EXTRA_DICE = "Extra Dice",
  GEMS = "Gems",
  CHROMA = "Chromatic Keys",
  WISHES = "Wish Coins",
  SHOVELS = "Rune Shovels",
  PROMISE = "Promise Shovels",
  OTTA = "Otta Shards",
  GOLD = "Gold Coins"

class SimulationDetails:
  """Details about the simulation
  """
  def __init__(self, label: str, multipliers: list[int]):
    self.label = label
    self.multipliers = multipliers

class SimResult:
  """Result of a simulation
  """
  points_breakpoints = [bp + s for s in [0, 20000, 40000, 60000, 80000] for bp in [2000, 5000, 8000, 12000, 16000, 20000]]

  roll_dice_task_breakpoints = [5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600]
  roll_dice_task_reward = [1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

  def __init__(self):
    self.points_bp_met = -1
    self.roll_dice_bp_met = -1
    self.stats = {}
    for stat in Stat:
      self.stats[stat] = 0

  def add_points(self, num_points: int):
    """Add points to the result AND get the number of dice we get back from meeting points breakpoints

    Args:
      num_points (int): Number of points to add
    """
    if (num_points <= 0):
      return 0
    
    # add points to result
    self.stats[Stat.POINTS] += num_points

    # check if we met any points breakpoints
    num_dice = 0
    for bp in self.points_breakpoints[self.points_bp_met+1:]:
      if (self.stats[Stat.POINTS] < bp):
        break
      self.points_bp_met += 1
      num_dice += 2

    self.stats[Stat.EXTRA_DICE] += num_dice
  
  def add_rolls(self, num_rolls: int):
    """Add number of rolls to the result AND get the number of dice we get back from meeting Roll Dice task breakpoints

    Args:
      num_rolls (int): Number of rolls to add
    """
    if (num_rolls <= 0):
      return 0

    # add rolls done to result
    self.stats[Stat.ROLLS_DONE] += num_rolls

    # ONLY add to initial dice IF we run out of free dice
    if (self.stats[Stat.EXTRA_DICE] <= num_rolls):
      self.stats[Stat.INITIAL_DICE] += num_rolls - self.stats[Stat.EXTRA_DICE]
    self.stats[Stat.EXTRA_DICE] = max(0, self.stats[Stat.EXTRA_DICE] - num_rolls)

    # check if we meet any task breakpoints
    num_dice = 0
    for bp in self.roll_dice_task_breakpoints[self.roll_dice_bp_met+1:]:
      if (self.stats[Stat.ROLLS_DONE] < bp):
        break
      self.roll_dice_bp_met += 1
      num_dice += self.roll_dice_task_reward[self.roll_dice_bp_met]

    self.stats[Stat.EXTRA_DICE] += num_dice

class Tile(ABC):
  """
  A single tile on the board
  """
  def roll(self, multiplier: int, result: SimResult):
    """Do a dice roll from this tile

    Args:
      multiplier (int): The multiplier applied to this tile
      result (SimResult): The cumulative result of the simulation run that we will add to

    Returns:
      int: The sum of the two dice results
    """
    result.add_rolls(multiplier)
    return random.randint(1, 6) + random.randint(1, 6)

  @abstractmethod
  def get_reward(self, multiplier: int, result: SimResult):
    """Get the reward from landing on a tile

    Args:
      multiplier (int): The multiplier applied to this tile
      result (SimResult): The cumulative result of the simulation run that we will add to
    """    
    pass

  @abstractmethod
  def get_value(self):
    """Get the value of this tile in terms of points AND dice

    Returns:
      tuple[int,int]: Number of points, Number of dice
    """
    pass

class FlatTile(Tile):
  def __init__(self, points: int = 0, gems: int = 0, dice: int = 0):
    """Create a FlatTile that just gives the amount of resource

    Args:
      points (int, optional): Number of points. Defaults to 0.
      gems (int, optional): Number of gems. Defaults to 0.
      dice (int, optional): Number of dice. Defaults to 0.
    """
    self.points = points
    self.gems = gems
    self.dice = dice

  def get_reward(self, multiplier: int, result: SimResult):
    result.add_points(self.points * multiplier)

    result.stats[Stat.GEMS] += (self.gems * multiplier)

    result.stats[Stat.EXTRA_DICE] += (self.dice * multiplier)

  def get_value(self):
    return self.points, self.dice

class GrandPrizeTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    prizes = [
      { 'prize': Stat.CHROMA, 'amount': 2},
      { 'prize': Stat.WISHES, 'amount': 1},
      { 'prize': Stat.GEMS, 'amount': 100},
      { 'prize': Stat.PROMISE, 'amount': 1},
      { 'prize': Stat.EXTRA_DICE, 'amount': 2},
      { 'prize': Stat.EXTRA_DICE, 'amount': 1},
    ]
    prize_weights = [
      666,
      2666,
      2666,
      666,
      666,
      2666
    ]
    spins = random.choices(prizes, weights=prize_weights)
    spin = spins[0]
    result.stats[spin['prize']] += (spin['amount'] * multiplier)
  
  def get_value(self):
    return 0, (666 * 2 + 2666 * 1) / 10000

class PointWheelTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    points = [100, 200, 500, 1000]
    points_weights = [3478,3478, 2608, 434]
    spins = random.choices(points, weights=points_weights)
    spin = spins[0]
    multipliers = [1, 3, 5]
    multipliers_weights = [6153, 3076, 769]
    spins2 = random.choices(multipliers, weights=multipliers_weights)
    spin2 = spins2[0]
    result.add_points(spin * spin2 * multiplier)
  
  def get_value(self):
    # spin points
    point_value = (3478 * 100 + 3478 * 200 + 2608 * 500 + 434 * 1000) / 10000
    # spin multipliers
    point_value *= (6153 * 1 + 3076 * 3 + 769 * 5) / 10000
    return point_value, 0

class FateWheelTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    prizes = [
      { 'prize': Stat.POINTS, 'amount': 500},
      { 'prize': Stat.OTTA, 'amount': 2},
      { 'prize': Stat.WISHES, 'amount': 1},
      { 'prize': Stat.EXTRA_DICE, 'amount': 1},
      { 'prize': Stat.GOLD, 'amount': 2000},
    ]
    prize_weights = [
      2500,
      300,
      700,
      1500,
      5000,
    ]
    spins = random.choices(prizes, weights=prize_weights)
    spin = spins[0]
    if (spin['prize'] == Stat.POINTS):
      result.add_points(spin['amount'] * multiplier)
    else:
      result.stats[spin['prize']] += (spin['amount'] * multiplier)
  
  def get_value(self):
    return (500 * 2500) / 10000, (1500 * 1) / 10000

def calc_best_multipliers(board: list[Tile], multiplier: int):
  """Calculate the best multipliers for the board

  Args:
    board (list[Tile]): The board
    multiplier (int): The multiplier to set around the board

  Returns:
    list[int]: The best multipliers to apply when rolling from each tile of the board
  """
  tile_values: list[tuple[float,float]] = [tile.get_value() for tile in board]
  #dice value = average points gained per die / (1 - average die gained per die)
  dice_value = statistics.fmean([v[0] for v in tile_values]) / (1 - statistics.fmean([v[1] for v in tile_values]))
  # calculated value of tiles in terms of points with NO APPLIED MULTIPLIERS
  tile_calc_values = [v[0] + v[1]*dice_value for v in tile_values]
  # get the total point value of each tile based on what tiles can be reached from it
  def get_values(index: int, num_hits: int):
    points = tile_values[index][0] * num_hits / 36
    dice = tile_values[index][1] * num_hits / 36
    value = tile_calc_values[index] * num_hits / 36
    return points, dice, value
  tile_mult_value: list[tuple[float, float, float]] = []
  for i in range(len(tile_calc_values)):
    total_points = 0
    total_dice = 0
    total_value = 0
    # 2 → 1 way: (1+1)
    points, dice, value = get_values((i + 2) % 24, 1)
    total_points += points
    total_dice += dice
    total_value += value
    # 3 → 2 ways: (1+2, 2+1)
    points, dice, value = get_values((i + 3) % 24, 2)
    total_points += points
    total_dice += dice
    total_value += value
    # 4 → 3 ways: (1+3, 2+2, 3+1)
    points, dice, value = get_values((i + 4) % 24, 3)
    total_points += points
    total_dice += dice
    total_value += value
    # 5 → 4 ways: (1+4, 2+3, 3+2, 4+1)
    points, dice, value = get_values((i + 5) % 24, 4)
    total_points += points
    total_dice += dice
    total_value += value
    # 6 → 5 ways: (1+5, 2+4, 3+3, 4+2, 5+1)
    points, dice, value = get_values((i + 6) % 24, 5)
    total_points += points
    total_dice += dice
    total_value += value
    # 7 → 6 ways: (1+6, 2+5, 3+4, 4+3, 5+2, 6+1)
    points, dice, value = get_values((i + 7) % 24, 6)
    total_points += points
    total_dice += dice
    total_value += value
    # 8 → 5 ways: (2+6, 3+5, 4+4, 5+3, 6+2)
    points, dice, value = get_values((i + 8) % 24, 5)
    total_points += points
    total_dice += dice
    total_value += value
    # 9 → 4 ways: (3+6, 4+5, 5+4, 6+3)
    points, dice, value = get_values((i + 9) % 24, 4)
    total_points += points
    total_dice += dice
    total_value += value
    # 10 → 3 ways: (4+6, 5+5, 6+4)
    points, dice, value = get_values((i + 10) % 24, 3)
    total_points += points
    total_dice += dice
    total_value += value
    # 11 → 2 ways: (5+6, 6+5)
    points, dice, value = get_values((i + 11) % 24, 2)
    total_points += points
    total_dice += dice
    total_value += value
    # 12 → 1 way: (6+6)
    points, dice, value = get_values((i + 12) % 24, 1)
    total_points += points
    total_dice += dice
    total_value += value

    tile_mult_value.append(tuple([total_points, total_dice, total_value]))

  # sort the indices of the tile_mult_value such that the values are in descending order
  sorted_index = sorted(range(len(tile_mult_value)), key=lambda i: tile_mult_value[i][2], reverse=True)

  best_multiplier = [1] * 24
  best_ppd = sum([best_multiplier[i] * tile_mult_value[i][2] for i in range(len(best_multiplier))]) / sum(best_multiplier)
  for i in range(len(sorted_index)):
    best_multiplier[sorted_index[i]] = multiplier

    # Average Projected Dice Value = Sum(PDVxM) / Sum(Tile Multipliers)
    avg_num_dice = sum([best_multiplier[j] * tile_mult_value[j][1] for j in range(len(best_multiplier))]) / sum(best_multiplier)
    # PPID = Sum(Project Points Value of Tile * Tile Multiplier) / Sum(Tile Multipliers) / (1 - Average Projected Dice Value)
    ppd = sum([best_multiplier[j] * tile_mult_value[j][0] for j in range(len(best_multiplier))]) / sum(best_multiplier) / (1 - avg_num_dice)
    if (ppd < best_ppd):
      best_multiplier[sorted_index[i]] = 1
      break
    best_ppd = ppd
  return best_multiplier

def output_stats(df: pandas.DataFrame):
  avg_stats = df.mean()
  print(f"PPID: {avg_stats[Stat.POINTS] / (avg_stats[Stat.INITIAL_DICE] - avg_stats[Stat.EXTRA_DICE])}")
  print(f"PPR: {avg_stats[Stat.POINTS] / avg_stats[Stat.ROLLS_DONE]}")
  print(avg_stats)

def simulate_single_run(board: list[Tile], multipliers: list[int], num_dice_rolls: int, points_to_meet: int, current_points: int = 0, dice_used: int = 0, current_tile: int = 0):
  """Simulate going around the board starting with a specified number of dice rolls

  Args:
    board (list[Tile]): The board
    multipliers (list[int]): The multipliers to apply when rolling from each tile
    num_dice_rolls (int): Number of dice to start with. The sim will stop if all of these dice are used.
    points_to_meet (int): Number of points to aim for. The sim will stop if we reach this threshold even if we didn't use all starting dice.
    current_points (int, optional): The current number of points we have. Defaults to 0.
    dice_used (int, optional): The number of dice we have used. Defaults to 0.
    current_tile (int, optional): The current tile we are on. Defaults to 0.
  
  Returns:
    SimResult: Result of simulation
  """
  result = SimResult()
  # add dice_used but clear out free_dice so it doesn't bleed over
  result.add_rolls(dice_used)
  result.stats[Stat.EXTRA_DICE] = 0
  # add current_points but clear out free_dice so it doesn't bleed over
  result.add_points(current_points)
  result.stats[Stat.EXTRA_DICE] = 0
  current_position = current_tile

  while (result.stats[Stat.POINTS] < points_to_meet and (result.stats[Stat.INITIAL_DICE] < num_dice_rolls or result.stats[Stat.EXTRA_DICE] > 0)) :
    # get multiplier then check if it's allowed
    num_turns = num_dice_rolls - result.stats[Stat.INITIAL_DICE] + result.stats[Stat.EXTRA_DICE]
    multiplier = multipliers[current_position]
    if (num_turns < 20):
      multiplier = min(1, multiplier)
    elif (num_turns < 30):
      multiplier = min(2, multiplier)
    elif (num_turns < 50):
      multiplier = min(3, multiplier)
    elif (num_turns < 100):
      multiplier = min(5, multiplier)

    # roll the dice
    old_tile = board[current_position]
    roll = old_tile.roll(multiplier, result)

    # land on new tile and get the reward
    current_position = (current_position + roll) % 24
    tile = board[current_position]
    tile.get_reward(multiplier, result)
  
  return result

def add_round_to_dataset(dataset, stats):
  """Add a simulation round stats to the dataset that will later be transformed into a pandas DataFrame

  Args:
      dataset (dict): dataset to add to
      stats (dict): simulation stats to add
  """
  for s in Stat:
    if (s in dataset):
      dataset[s].append(stats[s])
    else:
      dataset[s] = [stats[s]]

def simulation(sim_details: list[SimulationDetails], board: list[Tile], num_rounds: int, num_dices: list[int], points_to_meet: int, csv: bool = False):
  """Run simulations to get the average PPID using a specified number of starting dice. A single run will only end after all starting dice and free dice received in the run are used.

  Args:
    sim_details (list[SimulationDetails]): List of multipliers to run
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    num_dices (list[int]): List of the number of dice to start each simulation with
    points_to_meet (int): Number of points to aim for. The sim will stop if we reach this threshold even if we didn't use all starting dice.
    output_csv (bool): Whether we should output the runs in a CSV
  """
  for sim in sim_details:
    runs = []
    print(sim.label)
    for dices in num_dices:
      print('Simulation of {:,} players starting with {:,} dice each trying to reach {:,} points:'.format(num_rounds, dices, points_to_meet))
      print('Applied Multipliers: {}'.format(sim.multipliers))
      dataset = {}
      for i in range(num_rounds):
        result = simulate_single_run(board, sim.multipliers, dices, points_to_meet)
        add_round_to_dataset(dataset, result.stats)
        if (i % 10000 == 9999):
          print(f'{i+1} sims done')
      df = pandas.DataFrame(dataset)
      output_stats(df)
      runs.append(df)
    sim_df = pandas.concat(runs)
    if (csv):
      sim_df.to_csv(f"generated/{sim.label}.csv", index=False)

board = [
  FlatTile(points=400),
  FlatTile(gems=50),
  FlatTile(points=50),
  FlatTile(points=400),
  FlatTile(points=800),
  FlatTile(points=50),
  FlatTile(dice=2),
  FlatTile(gems=50),
  GrandPrizeTile(),
  FlatTile(),           # GREEN PRESENT
  PointWheelTile(),
  FlatTile(points=50),
  FlatTile(points=200),
  FlatTile(),           # GREEN PRESENT
  FlatTile(dice=2),
  FlatTile(points=200),
  FlatTile(points=800),
  FlatTile(),           # GREEN PRESENT
  FlatTile(points=50),
  FlatTile(points=200),
  PointWheelTile(),
  FlatTile(),           # GREEN PRESENT
  FateWheelTile(),
  FlatTile(points=200),
]

sims = [
  # SimulationDetails('BestMultipliers', calc_best_multipliers(board, 10)),
  SimulationDetails('5x10', [ 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 10, 1 ]),
  SimulationDetails('bublite', [1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 10, 10]),
]

def calculate_success_rate(goal_points: int, num_dice: int, current_points: int = 0, rolls_done: int = 0, current_tile: int = 0):
  """Run 10,000 simulations and get how many of those runs were able to achieve the goal set

  Args:
    goal_points (int): The number of points to aim for
    num_dice (int): The number of dice we have
    current_points (int, optional): The current number of points we have. Defaults to 0.
    rolls_done (int, optional): The number of rolls we have done. Defaults to 0.
    current_tile (int, optional): The current tile we are on. Defaults to 0.
  """
  num_success = 0
  num_runs = 10_000
  for i in range(num_runs):
    run = simulate_single_run(board, sims[1].multipliers, num_dice + rolls_done, math.inf, current_points, rolls_done, current_tile)
    if (run.stats[Stat.POINTS] >= goal_points):
      num_success += 1
  success_rate = (num_runs - 1 if num_success == num_runs else num_success) / num_runs * 100
  print(f'Success rate: {success_rate}%')