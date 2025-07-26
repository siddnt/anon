here , in models we made schemas for our mongodb models   but inside schemas we are making validation schemas using zod.
these all created for doing. verification or checks easily using zod.

--------
3
bcz  of being edge time framework, this applicatoin made from next js do not run all time , jaise jaise user ki request aati hai tab excute hota hai. and also the functions that you write in next js run on time. 
but in pure backend things keep running all the time.

so now db is not connected all the time, it is connected only when the request comes. now what if you made 2 consecutinve requests, and in second requ, may be there exist already connection with db, this way you will take many db connections, so always next if db connected, it will not create new connection, it will use the existing one.


