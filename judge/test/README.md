## Judge test setup

First create a mysql user *coda* with access to *codadb.**

Then execute the *init.sql* script. This shall generates a few dummy tables so as to make the judge runnable.

```bash
./db.sh < init.sql
```

Note that you need to create the folder structure at /data/coda and put some submission files there, 
according to the test setup (e.g. *ac.cpp* under /data/coda/src submitted to problem #1) 

Test cases have to be prepared under /data/coda/inout.