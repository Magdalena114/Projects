# Guide

Here are all of the commands, beginning-to-end, to get this word count map-
reduce job to work properly.

## Ensure HDFS has files

The HDFS (Hadoop filesystem) should be set up properly, but check by doing
this:

`hdfs dfs -ls -R`

### Correct Response

You should see something like below (and maybe more):

```
drwxr-xr-x   - ec2-user supergroup          0 2018-09-03 21:03 word_count_input
-rw-r--r--   1 ec2-user supergroup       8260 2018-09-03 21:03 word_count_input/capacity-scheduler.xml
-rw-r--r--   1 ec2-user supergroup       1144 2018-09-03 21:03 word_count_input/core-site.xml
-rw-r--r--   1 ec2-user supergroup      10431 2018-09-03 21:03 word_count_input/hadoop-policy.xml
-rw-r--r--   1 ec2-user supergroup       1128 2018-09-03 21:03 word_count_input/hdfs-site.xml
-rw-r--r--   1 ec2-user supergroup        620 2018-09-03 21:03 word_count_input/httpfs-site.xml
-rw-r--r--   1 ec2-user supergroup       3518 2018-09-03 21:03 word_count_input/kms-acls.xml
-rw-r--r--   1 ec2-user supergroup        682 2018-09-03 21:03 word_count_input/kms-site.xml
-rw-r--r--   1 ec2-user supergroup       1220 2018-09-03 21:03 word_count_input/mapred-site.xml
-rw-r--r--   1 ec2-user supergroup       1225 2018-09-03 21:03 word_count_input/yarn-site.xml
```

If you see all of those files, then you can move on to the next section, *****!!!!!

### Missing Files in HDFS

If you do get a listing, but don't see those files, then do the following
(adjust as appropriate):

```
hdfs dfs -mkdir /user
hdfs dfs -mkdir /user/ec2-user
hdfs dfs -mkdir /user/ec2-user/word_count_input
hdfs dfs -put etc/hadoop/*.xml word_count_input
```

As you can see, the first 3 lines just create the hierarchy structure. (By
default, HDFS **uses** your user home path when you don't provide an absolute
path, but it **doesn't create** that user home path for you!)

The last line actually adds all of the files to the HDFS system. In this toy
example, we're just taking our config XML files. It doesn't really matter,
this is just to play around with.


### HDFS is Down

If you see something like the following

`ls: Call From ip-172-31-10-136.us-west-2.compute.internal/172.31.10.136 to localhost:9000 failed on connection exception: java.net.ConnectException: Connection refused; For more details see:  http://wiki.apache.org/hadoop/ConnectionRefused`

then this means that the HDFS system is down for some reason. You ***can*** try
to fix it; we have another image we can launch if necessary, but best and
easiest to contact Prof. Mike.

## Ensure Output Directory **Does Not** Exist

Hadoop ***always*** creates a new directory in HDFS to store the output.
Moreover, it will not even run the job if it sees that the directory exists.
So you have to make sure it is not there.

Let's say you want to call your directory `my_results`. Then run:

`hdfs dfs -ls -R`

and make sure there is no directory called `my_results`

## Run the Map-Reduce Job

Since this is just an example to get hadoop to work, the map-reduce jobs are
already made for you. So you can jump into running the job, which in this case
is going to **count the number of times each word appears** in those XML files
that we copied above.

Type:

```
hadoop jar ~/hadoop-3.1.1/share/hadoop/tools/lib/hadoop-streaming-3.1.1.jar \
-files ~/hadoop-3.1.1/examples/word_count/mapper.py,/home/ec2-user/hadoop-3.1.1/examples/word_count/reducer.py \
-mapper ~/hadoop-3.1.1/examples/word_count/mapper.py \
-reducer ~/hadoop-3.1.1/examples/word_count/reducer.py \
-input word_count_input/* \
-output my_results
```

Let's break down what that command is doing:

- `hadoop`
    - Provides us access to all of the Hadoop commands
    - NOTE: you can also use `yarn`, which provides access to the higher level
Resource Manager in case you have more complex jobs. In fact, you can do it for
this command, too. Just type the exact same command, but replace that initial
`hadoop` command with `yarn`.
- `jar`
    - Run a `jar` file (Java ARchive). This is a compiled (and zipped) file
that Java can run. Remember, Hadoop is written in Java. However, I wasn't going
to expect anyone to learn Java just to do this exercise. So, we have a small
"cheat", we pass the `hadoop-streaming-3.1.1.jar` file as our `jar` file, which
allows us to use [Hadoop Streaming](https://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/)
and recognize that both the *map* and the *reduce* processes will *read* and
*write* from `STDIN` and `STDOUT`, respectively.
- `files ~/hadoop-3.1.1/examples/word_count/mapper.py,/home/ec2-user/hadoop-3.1.1/examples/word_count/reducer.py`
    - We need to specify the files that we're using (beyond those used as input
data, we'll mention that later). Since we have created our own map and reduce
Python files, we need to specify them.
    - NOTE: If you look at the Python files, you'll notice that they start with
the necessary `#!/usr/bin/env python`. This tells the system that the code
[should be run with python](https://stackoverflow.com/questions/2429511/why-do-people-write-the-usr-bin-env-python-shebang-on-the-first-line-of-a-pyt).
    - NOTE: These files ***are local***, not HDFS files. (The safe assumption
is that executables or scripts will be small in size.)
- `mapper ~/hadoop-3.1.1/examples/word_count/mapper.py`
    - We define the file that will act as the mapper.
- `reducer ~/hadoop-3.1.1/examples/word_count/reducer.py`
    - We define the file that will act as the reducer.
- `input word_count_input/*`
    - We provide all of the input **files**. Note that since we're using the
`*`, all files in the input directory should be used.
    - NOTE: Here we are referring to input files ***in the HDFS system***.
Above with the mapper & reducer, we were looking locally.
- `output my_results`
    - We provide the output **directory**. Remember that this directory **must
not exist** or else the job will fail. Hadoop does not allow itself to
overwrite anything, the user must actively make the decision to destroy files.
Also, since at least 2 files will be output (the results will consume at least
1 file, possibly more, and another file is written to say whether or not the
job succeeded.)

## Run the Job Without Hadoop

Remember, Map Reduce is a **paradigm** that we're learning, which is useful for
parallelizing massive jobs to drastically increase throughout and to allow for
jobs which would be too large to fit on any single machine.

But, in this case, our job isn't large at all, we were just using it as a toy.
So, let's run the Map Reduce job, but without any Hadoop infrastructure. There
are 2 reasons to go through this exercise:

1. To show that there is nothing "special" about map-reduce, per se, except
that it must be structured so that:
    - Each *map* job can be run independently.
    - The *map* and *reduce* jobs must be structured so that they emit and
accept key-value pairs in a way that the reducer can complete its task.
2. To better understand what each element does, by looking at the map and
reduce tasks without the vaneer of Hadoop.

Type:

```
cat word_count_input/* | examples/word_count/mapper.py | \
sort -k1 | examples/word_count/reducer.py 
```

---

Let's break down what that command is doing:

- `cat word_count_input/*`
    - Output everything written in the `word_count_input` directory to STDOUT.
- `| examples/word_count/mapper.py`
    - The output of `cat` is
[piped](https://www.geeksforgeeks.org/piping-in-unix-or-linux/) to our mapper.
    - This will provide us with an ***unsorted** list of words. In short, it
gives us the key-value of `1 <word>` (E.g., `1 config`), so that it will always
have the value 1. (The reducer is doing the actual counting.)
- `| sort -k1,1`
    - We then pipe the output from the *map* process above to unix's `sort`.
You can look it up, but the `-k1,1` means that we will use 2 keys, the first
entry (which is the actual word), then the number (which is always 1, so this
isn't actually necessary, but it is provided in case you want to test out a
more complicated type of mapper).
    - NOTE: Hadoop **automatically sorts for us**, which is why we didn't need
any call to a sorting function in the `hadoop`/`yarn` calls we'd done earlier.
    - Without sorting, the functions do not work as intended. See the
discussion below, with the shorter command.
- `| examples/word_count/reducer.py`
    - Then feed the results of the sort into the reducer function. Here the
key-value combinations are tallied and the true count of the words is provided.
    - Since there are no further pipes, the output from this code - which is
sent to STDOUT just like the previous steps - is shown on-screen.

---

NOTE:  This function, without Hadoop, is ***drastically*** faster. Why is that?
And, if that's the case, why are we using Hadoop?

- The [communication between the nodes and managers](https://www.datadoghq.com/blog/hadoop-architecture-overview/)
is significant, especially when the job itself is so trivial.
- The HDFS file system has an added layer of complexity, since the files are
[sharded into 64MB blocks](https://stackoverflow.com/questions/19473772/data-block-size-in-hdfs-why-64mb)
and communication with the `namenode` is needed to find them.
- Most importantly, all this work is being done on only 1 machine, which is
fundamentally against the point of having a Hadoop **cluster**, but we have
just 1 machine to keep the costs lower for Pacific. There is no difference
in running 100 machines or 1 machine, in terms of how all of Hadoop was set
up on this machine, except that it runs much slower and it cannot store as much
data.

### Try Just Some of the WorkFlow

Now that we have done the "entire" workflow without Hadoop, you can take it
apart to better understand each step.

Instead of typing

```
cat word_count_input/* | examples/word_count/mapper.py | \
sort -k1 | examples/word_count/reducer.py
```

just type

Type:

```
cat word_count_input/* | examples/word_count/mapper.py
```

This will provide you with a glimpse of what comes out from the mapper.

---

Or try

```
cat word_count_input/* | examples/word_count/mapper.py | \
sort -k1
```

This will show you what is being fed into the reducer before it
finishes its job.
