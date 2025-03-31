# Archero 2 Island Treasure Hunt Simulator
A script to simulate Archero 2 Island Treasure Hunt.
This is mainly used to determine the best multipliers to apply to each of the tiles.

## Dependencies
- python3 

## Available types of simulations
```python
simulation1(sim_details: list[SimulationDetails], board: list[Tile], num_rounds: int, num_dices: list[int], csv: bool = False):
  """Run simulations to get the average PPID using a specified number of starting dice.
    A single run will only end after all starting dice and free dice received in the run are used.

  Args:
    sim_details (list[SimulationDetails]): Different multipliers to run
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    num_dices (list[int]): List of the number of dice to start each simulation with
    output_csv (bool): Whether we should output the runs in a CSV
  """
```

```python
simulation2(sim_details: list[SimulationDetails], board: list[Tile], num_rounds: int, points_to_meet: int, csv: bool = False):
  """Run simulations to get the average number of dice required initially to reach a specified point 
    threshold.
    This does not take into account how many dice you actually have and will assume you can always apply 
    the multiplier specified.

  Args:
    sim_details (list[SimulationDetails]): Different multipliers to run
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    points_to_meet (int): Number of points to reach until we end the simulation
    output_csv (bool): Whether we should output the runs in a CSV
  """
```

## How to run
1. In terminal, run `python -i simulate.py`
2. You will see `>>>` which means you can now run the functions available in the script
3. Example function usage: `>>> simulate1(sims, board, 10_000, [500])`
   - This will run 10,000 rounds of `simulate_starting_dice` starting with 500 dice for each of the multipliers in `sims`

### Adding a new multiplier
We have a few multipliers already saved in `sims` so check them out in `simulate.py`.

To create a new one, you can:
1. Run `>>> new_sim_var = SimulationDetails({unique label/filename}, {multipliers (must be a list of 24 integers)})`
2. Run `>>> simulate1([new_sim_var], board, 10_000, [500])`