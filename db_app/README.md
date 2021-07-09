### Create Table Command
~~~~sql
create table digiart (token text primary key, data blob);
insert into digiart values('temptoken', 'data:image/png;base64,iVBORw0KGgoAAA...')
~~~~