# Archero 2 Island Treasure Hunt Simulator
A script to simulate Archero 2 Island Treasure Hunt.
This is mainly used to determine the best multipliers to apply to each of the tiles.

## Dependencies
- python3 

## How to run
```python
def simulation(sim_details: SimulationDetails, board: list[Tile], num_rounds: int, num_dices: list[int], points_to_meet: int, csv: bool = False, save_history: bool = False):
  """Run simulations to get the average PPID using a specified number of starting dice. A single run will only end after all starting dice and free dice received in the run are used.

  Args:
    sim_details (SimulationDetails): Different multipliers to run depending on how many dice we have at the moment
    board (list[Tile]): The board
    num_rounds (int): The number of times to run simulation
    num_dices (list[int]): List of the number of dice to start each simulation with
    points_to_meet (int): Number of points to aim for. The sim will stop if we reach this threshold even if we didn't use all starting dice.
    output_csv (bool): Whether we should output the runs in a CSV
    save_history (bool): Whether we should save the state of run after every single roll. Will slow down sim.
  """
```
1. In terminal, run `python -i simulate.py`
2. You will see `>>>` which means you can now run the functions available in the script
3. Example function usage: `>>> simulation(sim, board, 100_000, [400], 100_000)`
   - This will run 100,000 rounds starting with 400 dice until we hit 100,000 points or run out of dice
4. You can set `num_dices=[math.inf]` to... have infinite dice! This will only stop once we hit `points_to_meet`
5. You can set `points_to_meet=math.inf` to... not have a points liimt. This will only stop once we run out of dice

### Adding a new multiplier
We have calculated what we consider the best multipliers and it is saved in `sim` so check them out in `simulate.py`.
You can look at `calc_best_multipliers` to see how we did this math.

To create a new one, you can:
1. When making your list of multipliers, make sure the order matches up with what we have in `board`.
2. You will be setting a different multiplier map for each of 2x, 3x, 5x, 10x. (You can use the same map for each multiplier if you would like)
2. Run 
    ```
    >>> new_sim = SimulationDetails(filename, {
      2: [multipliers (must be a list of 24 integers)],
      3: [multipliers (must be a list of 24 integers)],
      5: [multipliers (must be a list of 24 integers)],
      10: [multipliers (must be a list of 24 integers)],
    })
    ```
3. Run `>>> simulation(new_sim, board, 10_000, [500], 100_000)`