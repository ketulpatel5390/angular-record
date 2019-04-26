use trakhe5;
/* select count(*)  from song_distribution sd
    left join song_feedback sf on sd.DJUserId = sf.DJUserId and sd.SongId = sf.SongId
    where sf.DJUserId is null */
-- select * from song_feedback
-- delete from song_distribution where DJUserId = 2804
-- select s.songid, count(*),avg(sf.overallrating), s.songtitle, s.status from songs s
-- join song_feedback sf on s.songid = sf.songid
-- group by s.songid;
-- -- limit 5
-- show create table songs

-- SELECT s.* 
--                     FROM djcrate djc
--                     JOIN  songs s ON djc.SongId = s.SongId
--                     WHERE djc.DJUserId = 2804

-- select songid from songs where status = 'A' limit 0,10

-- select @@version;
-- insert into AuditLog (
--     UserId,
--     Action,
--     ActionData)
--     VALUES (0, 'Test', '{')
-- delete  from AuditLog;
-- select UserId, SPLIT_STRING(genre, '|', 1) split, genre from application
-- where Genre is not null and Genre != '';

-- select * from properties;
-- create lookup table
use trakhe5;
-- update Users
-- set admin_status = 1
-- where username = 'sirmodem_fan'
-- CREATE UNIQUE INDEX idx_NotificationRequests_Email ON NotificationRequests (Email);
-- select * from Users where Username like 'testaccount%';
-- select a.userid, a.appid, a.musicserved, g.name 
--     from application a
--     join genres g on a.musicserved like concat('%',g.name,'|%') ;
-- delete from Users where username like 'testaccount%';
-- truncate table UserGenres;
select * from UserGenres;