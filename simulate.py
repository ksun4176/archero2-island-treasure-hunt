import random
from abc import ABC, abstractmethod
import csv
import statistics

#region classes
class SimulationDetails:
  """Details about the simulation
  """
  def __init__(self, label: str, multipliers: list[int]):
    self.label = label
    self.multipliers = multipliers

class SimResult:
  """Result of a simulation
  """
  points: int = 0
  rolls_done: int = 0
  initial_dice: int = 0
  free_dice: int = 0
  gems: int = 0
  chroma: int = 0
  obsidian: int = 0
  otta: int = 0
  gold: int = 0

  points_breakpoints = [bp + s for s in [0, 20000, 40000, 60000, 80000] for bp in [2000, 5000, 8000, 12000, 16000, 20000]]
  points_bp_met = -1

  roll_dice_task_breakpoints = [5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600]
  roll_dice_task_reward = [1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  roll_dice_bp_met = -1

  def add_points(self, num_points: int):
    """Add points to the result AND get the number of dice we get back from meeting points breakpoints

    Args:
      num_points (int): Number of points to add
    """
    if (num_points <= 0):
      return 0
    
    # add points to result
    self.points += num_points

    # check if we met any points breakpoints
    num_dice = 0
    for bp in self.points_breakpoints[self.points_bp_met+1:]:
      if (self.points < bp):
        break
      self.points_bp_met += 1
      num_dice += 2

    self.free_dice += num_dice
  
  def add_rolls(self, num_rolls: int):
    """Add number of rolls to the result AND get the number of dice we get back from meeting Roll Dice task breakpoints

    Args:
      num_rolls (int): Number of rolls to add
    """
    if (num_rolls <= 0):
      return 0

    # add rolls done to result
    self.rolls_done += num_rolls

    # ONLY add to initial dice IF we run out of free dice
    if (self.free_dice <= num_rolls):
      self.initial_dice += num_rolls - self.free_dice
    self.free_dice = max(0, self.free_dice - num_rolls)

    # check if we meet any task breakpoints
    num_dice = 0
    for bp in self.roll_dice_task_breakpoints[self.roll_dice_bp_met+1:]:
      if (self.rolls_done < bp):
        break
      self.roll_dice_bp_met += 1
      num_dice = self.roll_dice_task_reward[self.roll_dice_bp_met]

    self.free_dice += num_dice

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

    result.gems += (self.gems * multiplier)

    result.free_dice += (self.dice * multiplier)

  def get_value(self):
    return self.points, self.dice

class GrandPrizeTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    spin = random.randint(1,10000)
    if (spin <= 666): # 2x chroma keys
      result.chroma += (2 * multiplier)
    elif (spin <= 666 + 2666): # 1x obsidian key
      result.obsidian += (1 * multiplier)
    elif (spin <= 666 + 2666 + 2666): # 100 gems
      result.gems += (100 * multiplier)
    elif (spin <= 666 + 2666 + 2666 + 666): # 1x chroma key
      result.chroma += (1 * multiplier)
    elif (spin <= 666 + 2666 + 2666 + 666 + 666): # 2x dice
      result.free_dice += (2 * multiplier)
    else: # 1x dice
      result.free_dice += (1 * multiplier)
  
  def get_value(self):
    return 0, (666 * 2 + 2666 * 1) / 10000

class PointWheelTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    spin = random.randint(1,10000)
    spin2 = random.randint(1,10000)
    spin_multiplier = 1
    if (spin2 <= 3076):
      spin_multiplier = 3
    elif (spin2 <= 3076 + 769):
      spin_multiplier = 5

    if (spin <= 3478): # 100 points
      result.add_points(100 * multiplier * spin_multiplier)
    elif (spin <= 3478 + 3478): # 200 points
      result.add_points(200 * multiplier * spin_multiplier)
    elif (spin <= 3478 + 3478 + 2608): # 500 points
      result.add_points(300 * multiplier * spin_multiplier)
    else: # 1000 dice
      result.add_points(400 * multiplier * spin_multiplier)
  
  def get_value(self):
    # spin points
    point_value = (3478 * 100 + 3478 * 200 + 2608 * 500 + 434 * 1000) / 10000
    # spin multipliers
    point_value *= (6153 * 1 + 3076 * 3 + 769 * 5) / 10000
    return point_value, 0

class FateWheelTile(Tile):
  def get_reward(self, multiplier: int, result: SimResult):
    spin = random.randint(1,10000)
    if (spin <= 2500): # 100 points
      result.add_points(500 * multiplier)
    elif (spin <= 2500 + 300): # 2x otta
      result.otta += (2 * multiplier)
    elif (spin <= 2500 + 300 + 700): # 1x chroma key
      result.chroma += (1 * multiplier)
    elif (spin <= 2500 + 300 + 700 + 1500): # 1x dice
      result.free_dice += (1 * multiplier)
    else: # 2000 gold
      result.gold += (2000 * multiplier)
  
  def get_value(self):
    return (500 * 2500) / 10000, (1500 * 1) / 10000
#endregion classes

#region helpers
def calc_best_multipliers(board: list[Tile]):
  """Calculate the best multipliers for the board

  Args:
    board (list[Tile]): The board

  Returns:
    list[int]: The best multipliers to apply when rolling from each tile of the board
  """
  tile_values: list[tuple[float,float]] = [tile.get_value() for tile in board]
  
  #dice value is based on average dice gained per die / (1 - average die gained per die)
  dice_value = statistics.fmean([v[0] for v in tile_values]) / (1 - statistics.fmean([v[1] for v in tile_values]))
  # calculated value of tiles in terms of points with NO APPLIED MULTIPLIERS
  tile_calc_values = [v[0] + v[1]* dice_value for v in tile_values]

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
    best_multiplier[sorted_index[i]] = 10

    # average number of dice gained with multiplier applied
    avg_num_dice = sum([best_multiplier[j] * tile_mult_value[j][1] for j in range(len(best_multiplier))]) / sum(best_multiplier)
    # PPID is (average points with multiplier applied) / (1 - average number of dice gained with multiplier applied)
    ppd = sum([best_multiplier[j] * tile_mult_value[j][0] for j in range(len(best_multiplier))]) / sum(best_multiplier) / (1 - avg_num_dice) 
    if (ppd < best_ppd):
      best_multiplier[sorted_index[i]] = 1
      break
    best_ppd = ppd
  return best_multiplier

averages_output = '''Averages:
- Number of points earned: {points:,}
- Number of dice needed initially: {initial_dice:,}
- Points per initial dice: {ppid:,}
- Number of rolls overall: {rolls:,}
- Points per roll: {ppd:,}
- Extra dice gotten: {free_dice:,}
- Gems gotten: {gems:,}
- Chroma keys gotten: {chroma:,}
- Obsidian keys gotten: {obsidian:,}
- Otta shards gotten: {otta:,}
- Gold gotten: {gold:,}
'''
min_output = '''Min:
- Number of points earned: {points:,}
- Number of dice needed initially: {initial_dice:,}
- Points per initial dice: {ppid:,}
- Number of rolls overall: {rolls:,}
- Points per roll: {ppd:,}
'''
max_output = '''Max:
- Number of points earned: {points:,}
- Number of dice needed initially: {initial_dice:,}
- Points per initial dice: {ppid:,}
- Number of rolls overall: {rolls:,}
- Points per roll: {ppd:,}
'''
def output_stats(runs: list[SimResult], comparator: int):
  """Output the stats of all the runs

  Args:
    runs (list[SimResult]): The simulation runs
    comparator (int): Either 1 or 2. 1 = use number of points earned to determine min/max. 2 = use number of dice needed initially to determine min/max.
  """
  num_rounds = len(runs)
  total_points = 0
  total_rolls_done = 0
  total_initial_dice = 0
  total_free_dice = 0
  total_gems = 0
  total_chroma = 0
  total_obsidian = 0
  total_otta = 0
  total_gold = 0
  min_index = max_index = 0
  min_value = max_value = runs[0].initial_dice if comparator == 2 else runs[0].points
  for i in range(num_rounds):
    run = runs[i]
    total_points += run.points
    total_rolls_done += run.rolls_done
    total_initial_dice += run.initial_dice
    total_free_dice += run.free_dice
    total_gems += run.gems
    total_chroma += run.chroma
    total_obsidian += run.obsidian
    total_otta += run.otta
    total_gold += run.gold
    if (comparator == 2): # get min/max based on number of dice needed initially
      if (run.initial_dice < min_value):
        min_index = i
        min_value = run.initial_dice
      if (run.initial_dice > max_value):
        max_index = i
        max_value = run.initial_dice
    else: # get min/max based on points gotten
      if (run.points < min_value):
        min_index = i
        min_value = run.points
      if (run.points > max_value):
        max_index = i
        max_value = run.points
  
  avg_points = total_points / num_rounds
  avg_initial_dice = total_initial_dice / num_rounds
  avg_rolls = total_rolls_done / num_rounds
  print(averages_output.format(
    points=avg_points,
    initial_dice=avg_initial_dice,
    ppid=avg_points / avg_initial_dice,
    rolls=avg_rolls,
    ppd=avg_points / avg_rolls,
    free_dice=total_free_dice / num_rounds,
    gems=total_gems / num_rounds,
    chroma=total_chroma / num_rounds,
    obsidian=total_obsidian / num_rounds,
    otta=total_otta / num_rounds,
    gold=total_gold / num_rounds
  ))
  min_points = runs[min_index].points
  min_rolls = runs[min_index].rolls_done
  min_dice = runs[min_index].initial_dice
  print(min_output.format(
    points=min_points,
    initial_dice=min_dice,
    ppid=min_points / min_dice,
    rolls=min_rolls,
    ppd=min_points / min_rolls,
  ))
  max_points = runs[max_index].points
  max_rolls = runs[max_index].rolls_done
  max_dice = runs[max_index].initial_dice
  print(max_output.format(
    points=max_points,
    initial_dice=max_dice,
    ppid=max_points / max_dice,
    rolls=max_rolls,
    ppd=max_points / max_rolls,
  ))

def output_csv(csv_file_name: str, runs: list[SimResult]):
  header = ['# of Points', '# of Dice Initially', 'Points per Initial Dice', '# of Rolls Done', 'Points per Roll', '# of Gems', '# of Chroma Keys', '# of Obsidian Keys', '# of Otta Shards', '# of Gold']
  with open(csv_file_name, 'w', newline='') as csvfile:
      csvwriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
      csvwriter.writerow(header)
      for run in runs:
        row = [
          run.points,
          run.initial_dice,
          run.points / run.initial_dice,
          run.rolls_done,
          run.points / run.rolls_done,
          run.gems,
          run.chroma,
          run.obsidian,
          run.otta,
          run.gold
        ]
        csvwriter.writerow(row)
#endregion helpers

def simulate_starting_dice(board: list[Tile], multipliers: list[int], num_dice_rolls: int):
  """Simulate going around the board starting with a specified number of dice rolls

  Args:
    board (list[Tile]): The board
    multipliers (list[int]): The multipliers to apply when rolling from each tile
    num_dice_rolls (int): Number of dice to start with

  Returns:
    SimResult: Result of simulation
  """
  result = SimResult()
  current_position = 0
  while (result.initial_dice < num_dice_rolls or result.free_dice > 0) :
    # get multiplier then check if it's allowed
    num_turns = num_dice_rolls - result.initial_dice + result.free_dice
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

def simulate_meeting_points(board: list[Tile], multipliers: list[int], points_to_meet: int):
  """Simulate going around the board until we reach a points breakpoint

  Args:
    board (list[Tile]): The board
    multipliers (list[int]): The multipliers to apply when rolling from each tile
    points_to_meet (int): Number of points to reach until we end the simulation

  Returns:
    SimResult: Result of simulation
  """
  result = SimResult()
  current_position = 0
  while (result.points < points_to_meet) :
    # get multiplier from original position then check if it's allowed
    multiplier = multipliers[current_position]

    # roll the dice
    old_tile = board[current_position]
    roll = old_tile.roll(multiplier, result)

    # land on new tile and get the reward
    current_position = (current_position + roll) % 24
    tile = board[current_position]
    tile.get_reward(multiplier, result)
  
  return result

def simulation1(sim_details: list[SimulationDetails], board: list[Tile], num_rounds: int, num_dices: list[int], csv: bool = False):
  """Run simulations to get the average PPID using a specified number of starting dice. A single run will only end after all starting dice and free dice received in the run are used.

  Args:
    sim_details (list[SimulationDetails]): Different multipliers to run
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    num_dices (list[int]): List of the number of dice to start each simulation with
    output_csv (bool): Whether we should output the runs in a CSV
  """
  for sim in sim_details:
    runs = []
    print(sim.label)
    for dices in num_dices:
      print('Simulation of {:,} players starting with {:,} dice each:'.format(num_rounds, dices))
      print('Applied Multipliers: {}'.format(sim.multipliers))
      for i in range(num_rounds):
        runs.append(simulate_starting_dice(board, sim.multipliers, dices))
        if (i % 10000 == 9999):
          print(f'{i+1} sims done')
      output_stats(runs, 1)
    if (csv):
      output_csv(f'{sim.label}.csv', runs)

def simulation2(sim_details: list[SimulationDetails], board: list[Tile], num_rounds: int, points_to_meet: int, csv: bool = False):
  """Run simulations to get the average number of dice required initially to reach a specified point threshold. This does not take into account how many dice you actually have and will assume you can always apply the multiplier specified.

  Args:
    sim_details (list[SimulationDetails]): Different multipliers to run
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    points_to_meet (int): Number of points to reach until we end the simulation
    output_csv (bool): Whether we should output the runs in a CSV
  """
  for sim in sim_details:
    runs = []
    print(sim.label)
    print('Simulation of {:,} players trying to reach {:,} points:'.format(num_rounds, points_to_meet))
    print('Applied Multipliers: {}'.format(sim.multipliers))
    for i in range(num_rounds):
      runs.append(simulate_meeting_points(board, sim.multipliers, points_to_meet))
      if (i % 10000 == 9999):
        print(f'{i+1} sims done')

    output_stats(runs, 2)
    if (csv):
      output_csv(f'{sim.label}.csv', runs)

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
  SimulationDetails('BestMultipliers', calc_best_multipliers(board)),
  SimulationDetails('NoMultipliers', [1] * 24),
  SimulationDetails('6x10', [ 1, 1, 1, 1, 1, 1, 1, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 10, 1 ]),
  SimulationDetails('AcidIced', [ 1, 1, 1, 1, 2, 3, 3, 5, 5, 2, 1, 1, 1, 1, 1, 1, 2, 3, 5, 10, 10, 10, 5, 2 ]),
  SimulationDetails('4x10', [ 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 1, 1 ]),
]