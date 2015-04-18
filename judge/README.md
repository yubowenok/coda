## Judging Queue
Coda judge watches a submission queue.
Each received submission is pushed to the queue.
The judge keeps processing the submissions until the judging queue becomes empty.
Each submission has a record in DB that tracks the status/result of the submission.

## Judging Status
Judging status is given by *status* and *verdict*.

| Status    | Code   | Verdict           |
|:---------:|:------:|:-----------------:|
| Pending   | 0      | NA                |
| Compiling | 1      | NA                |
| Running   | 2      | 1 .. test #       |
| Complete  | 3      | see verdict table |



## Verdicts
The verdict of a submission is given by the *verdict code* listed in the verdict table below.

| Verdict               | Code  |
|:---------------------:|:-----:|
| NA                    | -1    |
| Accepted              | 0     |
| Wrong Answer          | 1     |
| Runtime Error         | 2     |
| Time Limit Exceeded   | 3     |
| Memory Limit Exceeded | 4     |
| Output Limit Exceeded | 5     |
| Compilation Error     | 6     |
| System Error          | 10    |

For each test case, the judge returns its time and memory consumption, 
along with the an output snapshot and a checker message.
For compilation error, the snapshot contains a path to a file storing the compilation error message.
