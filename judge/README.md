## Judging Queue
Coda judge watches a submission queue.
Each received submission is pushed to the queue.
The judge keeps processing the submissions until the judging queue becomes empty.
Each submission has a record in DB that tracks the status/result of the submission.

## Judging Status
Judging status is given by *state* and *code*.

| State     | Code   | Range             |
|:---------:|:------:|:-----------------:|
| Pending   | 0      |  NA               |
| Judging   | 1      |  1 .. test #      |
| Complete  | 2      | see verdict table |



## Verdicts
The verdict of a submission is given by the *verdict code* listed in the verdict table below.

| Verdict               | Code  |
|:---------------------:|:-----:|
| Not Judged            | -1    |
| Accepted              | 0     |
| Wrong Answer          | 1     |
| Runtime Error         | 2     |
| Time Limit Exceeded   | 3     |
| Memory Limit Exceeded | 4     |
| Output Limit Exceeded | 5     |
| Compilation Error     | 6     |
| System Error          | 10    |

For each test case, a snapshot for the submission's output is generated.
The snapshots are then combined into an output result file to be written to FS.
For compilation error, the snapshot contains the compilation error messages.
