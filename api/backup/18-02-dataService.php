<?php

require_once '../path.php';
require_once 'constants.php';
require_once 'security-helpers.php';

class DataService {
    private $dsn = 'mysql:dbname=' . DB_NAME . ';host=' . DB_HOST . ';charset=utf8';
    private $user = DB_USER;
    private $password =DB_PASSWORD;

    public function getConnectionStatus() {
        try{
            //$this->getUser('rmodem_fan');
            $dbh = $this->getDb();
            return 'success';
        }
        catch(PDOException $e){
            return 'failure ' . $e->getMessage() . "dsn={$this->dsn} user={$this->user} pwd={$this->password}";
        }
    }

    public function addSongToCrate(int $userId, int $songId, string $favourite){
        $dbh = $this->getDb();
        $sql = 'INSERT INTO djcrate (DJUserId, SongId, Spins, favourite)
                    VALUES (:userId, :songId, "", :favourite)';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->bindValue(':favourite', $favourite);
        $sth->execute();
        $rv = $dbh->lastInsertId;
        return $rv;
    }

    private function array_parameterize(array $arr){
        $rv = [];
        $count = count($arr);
        
        for ($i = 0; $i < $count; $i++){
            $var = ":v$i";
            $rv[$var] = $arr[$i];
        }
        
        return $rv;
    }

    private function bindSetClauseValues(array $columnValues, $pdoStatement) {
        foreach ($columnValues as $key => $value) {
            $pdoStatement->bindValue(":$key", $value, gettype($value)=="integer" ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
    }
    private function buildSetClause(array $columnValues, string $prefix){
        $rv = ' SET ';
        foreach ($columnValues as $key => $value){
            $rv .= "$prefix.$key = :$key,";
        }
        $rv = substr($rv, 0, strlen($rv) - 1);   //removes trailing comma
        return $rv;
    }

    public function confirmEmail(int $conf_uid, int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * from `application` WHERE AppConfirmUID = :confUid AND UserId = :userId');
        $sth->execute([':userId'=> $userId, ':confUid'=> $conf_uid]);
        $rv = $sth->rowCount();
        if($rv)
        {
            /*$sql = 'UPDATE Application 
                    SET AppConfirmed = \'1\',
                        Approval_Status = \'A\'
                    WHERE AppConfirmUID = :confUid AND UserId = :userId';*/
             $sql = 'UPDATE application 
                    SET AppConfirmed = \'1\'
                    WHERE AppConfirmUID = :confUid AND UserId = :userId';
            $sth = $dbh->prepare($sql);
            $sth->execute([':userId'=> $userId, ':confUid'=> $conf_uid]);
            return $rv;
        }else{
            return $rv;
        }
      

    }

    public function deleteUser(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM users WHERE UserId = :userId');
        $sth->execute([':userId'=> $userId]);
    }

    public function distributeSongs($userId, $songsNeeded, $acceptedGenres){
        $dbh = $this->getDb();
        $sql = "INSERT INTO song_distribution (DJUserId, SongId, DistDate)
                    SELECT :userId, s.SongId, now()
                    FROM songs s
                    LEFT JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    WHERE s.genre IN ($acceptedGenres)
                        AND s.Status = 'A'
                        AND sd.DJUserId IS NULL
                        AND sf.DJUserId is NULL
                    ORDER BY s.DistDate
                    LIMIT :take";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':take', $songsNeeded, PDO::PARAM_INT);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->rowCount();

        $this->updateSongDistributionDates($userId);
        return $rv;
      
    }
    public function emailConfirmed(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("SELECT COUNT(*) AS total FROM application WHERE UserId = :userId 
            and Approval_Status ='A' AND AppConfirmed = '1'");
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv->total > 0;
    }

    private function getDb(): PDO {
        
        $rv = new PDO($this->dsn, $this->user, $this->password);
        $rv->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $rv;
    }

    public function getApplication(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * from `application` where UserId= :userId');
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        if ($rv && $rv->SongsReview == 0) $rv->SongsReview = 10;
        return $rv;
    }

    public function getApplicationById(int $appId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * from `application` where AppId= :appId');
        $sth->execute([':appId'=> $appId]);
        $rv = $sth->fetchObject();
        if ($rv && $rv->SongsReview == 0) $rv->SongsReview = 10;
        return $rv;
    }

    public function getApplicationByUserId(int $userId){
        $dbh = $this->getDb();

       $sql = 'SELECT 
                    AppId,
                    UserId,
                    FirstName,
                    LastName,
                    City,
                    StateOrProvince,
                    Country,
                    Gender,
                    Email,
                    Website,
                    AppDate,
                    Approval_Status,
                    AppConfirmed,
                    MusicServed,
                    SongsReview,
                    DOB,
                    RowVersion,
                    PromoSongs,
                    bio,
                    profile_pic,
                    facebook,
                    twitter, 
                    instagram, 
                    youtube
                    FROM `application` 
                    WHERE UserId= :userId';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        //if ($rv && $rv->SongsReview == 0) $rv->SongsReview = 10;
        //$rv=$this->massageApplication($rv);
        return $rv;
    }

    public function getApplications($skip,$take,$searchby,$sortkey,$sortreverse){
        //echo $skip."==".$sortreverse;
       // exit;
        $dbh = $this->getDb();
        $orderbybytag="";
        if($searchby != "" && $sortkey != "" ){
            if($sortkey == "Username"){
                 $orderbybytag="u";
            }else{
                $orderbybytag="a";
            }
            if($sortreverse == 'true' ){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT a.*, u.Username FROM application a 
                  INNER JOIN users u ON a.UserId = u.UserId
                  where u.UserId = '%$searchby%' or 
                  u.Username like '%".$searchby."%' or 
                  a.Email like '%".$searchby."%' or 
                  a.FirstName like '%".$searchby."%' or 
                  a.LastName like '%".$searchby."%' 
                  ORDER BY ".$orderbybytag.".".$orederby. " LIMIT $skip, $take";


        }else if($searchby != ""){
            $sql="SELECT a.*, u.Username FROM application a 
                  INNER JOIN users u ON a.UserId = u.UserId
                  where u.UserId = '%$searchby%' or 
                  u.Username like '%".$searchby."%' or 
                  a.Email like '%".$searchby."%' or 
                  a.FirstName like '%".$searchby."%' or 
                  a.LastName like '%".$searchby."%' 
                  ORDER BY a.AppDate DESC LIMIT $skip, $take";
        }else if($sortkey != ""){
            if($sortkey == "Username"){
                 $orderbybytag="u";
            }else{
                $orderbybytag="a";
            }
            if($sortreverse == 'true'){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT a.*, u.Username FROM application a 
            INNER JOIN users u ON a.UserId = u.UserId ORDER BY ".$orderbybytag.".".$orederby." LIMIT $skip, $take";

        }else{
           $sql = "SELECT a.*, u.Username FROM application a 
                    INNER JOIN users u ON a.UserId = u.UserId
                    ORDER BY a.AppDate DESC
                    LIMIT $skip, $take";
        }
        //echo  $sql;
        $sth = $dbh->prepare($sql);
        //$sth->bindValue(':skip', $skip);
        //$sth->bindValue(':take', $take);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getApplicationsCount($searchby,$sortkey,$sortreverse){
        
         $dbh = $this->getDb();
        
        if($searchby != "" && $sortkey != "" ){
            if($sortkey == "Username"){
                 $orderbybytag="u";
            }else{
                $orderbybytag="a";
            }
            if($sortreverse == 'true'){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT COUNT(*) total FROM application a 
                  INNER JOIN users u ON a.UserId = u.UserId
                  where u.UserId = '%$searchby%' or 
                  u.Username like '%".$searchby."%' or 
                  a.Email like '%".$searchby."%' or 
                  a.FirstName like '%".$searchby."%' or 
                  a.LastName like '%".$searchby."%' 
                  ORDER BY ".$orderbybytag.".".$orederby;


        }else if($searchby != ""){
            $sql="SELECT COUNT(*) total FROM application a 
                  INNER JOIN users u ON a.UserId = u.UserId
                  where u.UserId = '%$searchby%' or 
                  u.Username like '%".$searchby."%' or 
                  a.Email like '%".$searchby."%' or 
                  a.FirstName like '%".$searchby."%' or 
                  a.LastName like '%".$searchby."%' 
                  ORDER BY a.AppDate DESC";
        }else if($sortkey != ""){
            if($sortkey == "Username"){
                 $orderbybytag="u";
            }else{
                $orderbybytag="a";
            }
            if($sortreverse == 'true'){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
             $sql="SELECT COUNT(*) total FROM application a 
            INNER JOIN users u ON a.UserId = u.UserId ORDER BY ".$orderbybytag.".".$orederby;

        }else{
            $sql = 'SELECT COUNT(*) total
                    FROM application a 
                    INNER JOIN users u ON a.UserId = u.UserId';
        }

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }

    public function getAuditLog(int $fromId){
        $dbh = $this->getDb();
        $sql = "SELECT al.*, u.Username FROM auditlog al 
                    LEFT JOIN users u ON al.UserId = u.UserId
                    WHERE al.Id >= :fromId
                    ORDER BY al.Timestamp DESC
                    LIMIT 500";
        $sth = $dbh->prepare($sql);
        // $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        // $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute([':fromId'=>$fromId]);
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getCountries(){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT country_code, country_name FROM country');
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $dbh = null;
        return $rv;
    }

    public function getCrateEntry(int $userId, int $songId){
        $dbh = $this->getDb();
        $sql = 'SELECT *
                    FROM djcrate c 
                    WHERE c.DJUserId = :userId AND c.SongId = :songId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getFeedback(int $songId, int $userId){
        $dbh = $this->getDb();
        $sql = 'SELECT *
                    FROM song_feedback sf
                    WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getFeedbackNeededCount(int $userId){
        $dbh = $this->getDb();

        $sql = 'SELECT COUNT(*) total
                    FROM song_distribution sd
                    LEFT JOIN song_feedback sf ON sd.DJUserId = sf.DJUserId AND sd.SongId = sf.SongId
                    WHERE sd.DJUserId = :userId AND sf.DJUserId IS NULL';
        
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv->total;
    }

    private function getGenresByNames($names) {
        $in = "";
        foreach ($names as $i => $value) {
            $key = ":in$i";
            $in .= "$key,";
            $inParams[$key] = $value;
        }
        $in = rtrim($in, ',');

        $dbh = $this->getDb();
        $sql = "SELECT * FROM genres
                    WHERE Name IN ($in)";
        $sth = $dbh->prepare($sql);
        $sth->execute($inParams);
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getGenresList(){
        $dbh = $this->getDb();
        $sql ="SELECT 
                    Id, 
                    Concat(Name,'_', GroupName) Name_GroupName
                    FROM genresofficial";
        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $dbh = null;
        return $rv;
    }

    public function getLibrary(int $userId, int $skip, int $take,$sortbygener, $sortkey,$sortreverse){
        $dbh = $this->getDb();
         $orderbybytag="";
        if($sortbygener != "" && $sortkey != "" ){
            if($sortkey == "FeedbackGivenDate"){
                 $orderbybytag="sf";
            }else{
                $orderbybytag="s";
            }
            if($sortreverse == 'true' ){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId ,s.wheretobuy, albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId and s.Genre = ".$sortbygener." group by new_albumId ORDER BY ".$orderbybytag.".".$orederby. " LIMIT $skip, $take";


        }else if($sortbygener != ""){
            $sql="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId ,s.wheretobuy, albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId and s.Genre = ".$sortbygener." group by new_albumId ORDER BY djc.Id LIMIT $skip, $take";
        }else if($sortkey != ""){
            if($sortkey == "FeedbackGivenDate"){
                 $orderbybytag="sf";
            }else{
                $orderbybytag="s";
            }
            if($sortreverse == 'true'){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId ,s.wheretobuy, albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId group by new_albumId ORDER BY ".$orderbybytag.".".$orederby." LIMIT $skip, $take";

        }else{
           $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId ,s.wheretobuy, albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId group by new_albumId order by djc.Id DESC
                    LIMIT $skip, $take";
        }
        //echo $sql;
       /* $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM DJCrate djc
                    JOIN  Songs s ON djc.SongId = s.SongId
                    INNER JOIN Users u ON  s.UserId = u.UserId
                    JOIN GenresOfficial Go ON Go.Id = s.Genre 
                    LEFT JOIN Song_Feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId group by new_albumId order by djc.Id DESC
                    LIMIT :skip, :take";*/
                    
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        //$sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        //$sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getLibraryCount(int $userId,$sortbygener, $sortkey,$sortreverse){
        $dbh = $this->getDb();
                 $orderbybytag="";
        if($sortbygener != "" && $sortkey != "" ){
            if($sortkey == "FeedbackGivenDate"){
                 $orderbybytag="sf";
            }else{
                $orderbybytag="s";
            }
            if($sortreverse == 'true' ){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId and s.Genre = ".$sortbygener." group by new_albumId ORDER BY ".$orderbybytag.".".$orederby;


        }else if($sortbygener != ""){
            $sql="SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId and s.Genre = ".$sortbygener." group by new_albumId ORDER BY djc.Id";
        }else if($sortkey != ""){
            if($sortkey == "FeedbackGivenDate"){
                 $orderbybytag="sf";
            }else{
                $orderbybytag="s";
            }
            if($sortreverse == 'true'){
                $orederby = $sortkey." ASC";
            }else{
                $orederby = $sortkey." DESC";
            }
            $sql="SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId group by new_albumId ORDER BY ".$orderbybytag.".".$orederby;

        }else{
           $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId group by new_albumId";
        }

       /* $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM DJCrate djc
                    JOIN  Songs s ON djc.SongId = s.SongId
                    INNER JOIN Users u ON  s.UserId = u.UserId
                    JOIN GenresOfficial Go ON Go.Id = s.Genre 
                    LEFT JOIN Song_Feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId group by new_albumId";*/
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        //$rv = $sth->fetchObject();
       // return $rv->total;
        $count = $sth->rowCount();
        //return $rv->total;
        return $count;
       
    }
    public function getLog(int $fromId){
        $dbh = $this->getDb();
        $sql = "SELECT l.*, u.Username, c.Name Category FROM log l 
                    LEFT JOIN users u ON l.UserId = u.UserId
                    LEFT JOIN categories c ON l.CategoryId = c.Id
                    WHERE l.Id >= :fromId
                    ORDER BY l.Timestamp DESC
                    LIMIT 500";
        $sth = $dbh->prepare($sql);
        // $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        // $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute([':fromId'=>$fromId]);
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getPackage(int $pkgId){
        $dbh = $this->getDb();
        $sql = "SELECT ap.*
                    FROM account_packages ap
                    WHERE ap.PkgId = :pkgId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':pkgId', $pkgId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getPackagesList(){
        $dbh = $this->getDb();
        $min = SONGBOOK_PKGID;
        if (IS_SONGBOOK == 0) $min++;

       /* $sql ="SELECT 
                    PkgId, 
                    Concat(PkgDetail,' ', 
                        (IF(Price > 0, Concat('(\$', Price, '; ', IF(Songs = -1, 'unlimited', Songs), ' songs',')'), ''))) PkgDisplayName
                    FROM account_packages
                    WHERE PkgId >= $min";*/
        $sql ="SELECT 
                    PkgId, 
                    Concat(PkgDetail,' ', 
                        (IF(Price >= 0, Concat('(\$', Price, '; ', IF(Songs = -1, 'unlimited', Songs), ' MB',')'), ''))) PkgDisplayName
                    FROM account_packages
                    WHERE PkgId >= $min";
        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $dbh = null;
        return $rv;
    }

    public function getPortfolio(int $userId, int $skip, int $take){
        $dbh = $this->getDb();
        $countpro = $this->getpromember($userId);
        if($countpro == 1){
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId group by new_albumId  ORDER BY s.SongId DESC
                    LIMIT :skip, :take";
        }else{
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId and (s.Status = 'A' or s.Status = 'QA'  or s.Status = 'Inprocess' ) group by new_albumId  ORDER BY s.SongId DESC
                    LIMIT :skip, :take";
        }
        
        /*$sql = "SELECT s.* 
                    FROM  Songs s
                    WHERE s.UserId = :userId 
                       sg.Name SubGenre,  JOIN subgenres sg ON sg.Id = s.SubGenre
                   ,':albumtype' => $albuminfo->albumtype,
                ':albumName'=> $albuminfo->albumName, 
                    LIMIT :skip, :take";*/
       
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getPortfolioCount(int $userId){
        $dbh = $this->getDb();
         $countpro = $this->getpromember($userId);
        if($countpro == 1){
             $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    INNER JOIN users u ON  s.UserId = u.UserId
                    WHERE s.UserId = :userId group by new_albumId ";
        }else{
             $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    INNER JOIN users u ON  s.UserId = u.UserId
                    WHERE s.UserId = :userId and (s.Status = 'A' or s.Status = 'QA'  or s.Status = 'Inprocess' ) group by new_albumId ";
        }
        
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        // $rv = $sth->fetchObject();
         $count = $sth->rowCount();
        //return $rv->total;
         return $count;
    }

    public function getProperty($key){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT `Key`, `Value` FROM properties WHERE `Key` = :key');
        $sth->execute([':key'=>$key]);
        $rv = $sth->fetchObject();
        $dbh = null;
        return $rv;
    }
    public function getRadioStationUser(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * from radiostationuser where UserId= :userId');
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getSampleFilename($userId, $songId){
        $dbh = $this->getDb();
        //JOIN Song_Distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    
                   
        $sql = "SELECT s.SampleFile, s.SongPath, s.SongFile FROM songs s
                     WHERE s.SongId = :songId";
        $sth = $dbh->prepare($sql);
        //$sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
          
    }

    public function getSong($songId){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM songs s
                    WHERE s.SongId = :songId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
          
    }
     public function getSongbyuser($songId,$userId){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM songs s
                    WHERE s.SongId = :songId ";
                    //and s.UserId = :userId
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        //$sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
          
    }
    

    public function getSongs(int $skip, int $take,$userId, $searchname){
        $dbh = $this->getDb();
        /*$sql = "SELECT s.* FROM Songs s 
                    WHERE s.Status = 'A'
                    LIMIT :skip, :take";JOIN subgenres sg ON sg.Id = s.SubGenre 
                    */
        if( $searchname != ""){
            $sql ="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sf.OverallRating, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s 
             JOIN genresofficial Go ON Go.Id = s.Genre 
              INNER JOIN users u ON  s.UserId = u.UserId 
             LEFT JOIN  album albm on albm.album_id =  s.albumId
             LEFT JOIN song_feedback sf ON $userId= sf.DJUserId AND s.SongId = sf.SongId 
             WHERE s.Status = 'A' and (s.SongTitle like '%". $searchname."%' or s.ArtistName like '%". $searchname."%' or Go.Name like '%". $searchname."%' or albm.album_name like '%". $searchname."%' ) group by new_albumId ORDER BY s.SongId DESC
             LIMIT :skip, :take";
        }else{
            $sql ="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sf.OverallRating, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s 
             JOIN genresofficial Go ON Go.Id = s.Genre 
              INNER JOIN users u ON  s.UserId = u.UserId 
             LEFT JOIN  album albm on albm.album_id =  s.albumId 
             LEFT JOIN song_feedback sf ON $userId= sf.DJUserId AND s.SongId = sf.SongId
             WHERE s.Status = 'A' group by new_albumId ORDER BY s.SongId DESC
             LIMIT :skip, :take";
        }            
        
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getSongsCount($userId,$searchname){
        $dbh = $this->getDb();
        if( $searchname != ""){
            $sql = "SELECT COUNT(*) total, IFNULL(s.albumId,RAND()) as new_albumId
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    INNER JOIN users u ON  s.UserId = u.UserId 
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    LEFT JOIN song_feedback sf ON $userId= sf.DJUserId AND s.SongId = sf.SongId 
                    WHERE s.Status = 'A' and (s.SongTitle like '%". $searchname."%' or s.ArtistName like '%". $searchname."%' or Go.Name like '%". $searchname."%' or albm.album_name like '%". $searchname."%' ) group by new_albumId";
        }else{
            $sql = "SELECT COUNT(*) total, IFNULL(s.albumId,RAND()) as new_albumId
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN song_feedback sf ON $userId= sf.DJUserId AND s.SongId = sf.SongId 
                    INNER JOIN users u ON  s.UserId = u.UserId 
                    WHERE s.Status = 'A' group by new_albumId";
        }
        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        //return $rv->total;
        $count = $sth->rowCount();
        return $count;
       
        
    }

    public function getSongsToReview($userId,int $skip, int $take){
        $dbh = $this->getDb();
         /*$sql = "SELECT s.*, sd.DistDate FROM Songs s
                    JOIN Song_Distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN Song_Feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    WHERE sf.SongId IS NULL
                    ORDER BY sd.DistDate  LIMIT :skip, :take"; and (s.DistDate BETWEEN '". $beforedate."' AND '". $currentdate."') sf.SongId IS NULL and
                    */
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-30 days"));
          $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sd.DistDate ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."'
                   group by new_albumId ORDER BY s.DistDate DESC LIMIT :skip, :take";    
                         
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getsongsToReviewCount($userId){
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-30 days"));
         //and (s.DistDate BETWEEN '". $beforedate."' AND '". $currentdate."') sf.SongId IS NULL and
        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total, IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."'
                    group by new_albumId ORDER BY s.DistDate DESC";
               
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        //$rv = $sth->fetchObject();
        //return $rv->total;
         $count = $sth->rowCount();
        //return $rv->total;
         return $count;
    }

    public function getStates(){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("SELECT State_Abbr, State FROM states ORDER BY State ASC");
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $dbh = null;
        return $rv;
    }

    public function getUser(string $username){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * FROM users WHERE username = :username');
        $sth->execute([':username'=> $username]);
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getUserlogin(string $username){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("SELECT users.UserId, users.facebook_id, users.Username, users.Password, users.ResetCode, 
                                users.Session, users.IP, users.Cookie, users.PwdQ, users.PwdA, users.CreatedDate, 
                                users.PkgId, users.admin_status, users.dj_status, users.radio_status FROM users 
                              Left JOIN application ON Users.UserId = application.UserId 
                              WHERE Users.username = '".$username."' or application.Email = '".$username."'");
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getUserwithemail(string $username,string $email){
        /*SELECT * FROM Users 
                              INNER JOIN application ON users.UserId = application.UserId 
                              WHERE `Username` = :username and application.Email = :email*/
        $dbh = $this->getDb();
        $sth = $dbh->prepare("SELECT * FROM users WHERE `Username` = :username and email = :email ");
        $sth->execute([':username'=> $username ,
                       ':email'=> $email , 
                        ]);
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function getUserById(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT * FROM users WHERE UserId = :userId');
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }

    public function hasAccessToPackage(int $userId, int $pkgId): bool {
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT PkgId FROM user_pkgs WHERE UserId= :userId AND PkgId= :pkgId');
        $sth->execute([':userId'=> $userId, ':pkgId' => $pkgId]);
        $rv = $sth->fetchObject();
        return (bool)$rv;
    }

    public function insertApplication($app, $userId, $conf_uid){
        $dob = explode('-', $app->dob);
        $dob=$dob[2]."-".$dob[0]."-".$dob[1];
        
        $sql = "INSERT INTO application (UserId, FirstName,  LastName, DOB, City, StateOrProvince, Country, Email, SongsReview, AppConfirmUID, AppDate, MusicServed, Approval_Status)";
        $sql .= " VALUES (:userId, :firstName, :lastName, :dob, :city, :stateOrProvince, :country, :email, :songsReview, :appConfirmUid, NOW(), :musicServed, 'P')"; 
        $stateOrProvince = $app->country == 'US' ? $app->state : $app->city;

        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':userId'=> $userId, 
                ':firstName'=> $app->firstName,
                ':lastName'=> $app->lastName,
                ':dob'=> $dob,
                ':city'=> $app->city,
                ':stateOrProvince'=> $stateOrProvince, 
                ':country'=> $app->country,
                ':email'=> $app->email, 
                ':songsReview'=> $app->songReviewLimit, 
                ':appConfirmUid'=> $conf_uid, 
                ':musicServed'=> $app->genreString
            ]);
        $rv = $dbh->lastInsertId();
        $end = date('Y-m-d', strtotime('+1 years'));

        $packagedetail= $this->getPackage($app->package);
        if($packagedetail->Price > 0 ){
            $CCStatus = '0';
            $status='P';
        }else{
            $CCStatus = '1';
             $status='A';
        }

        $sql = "INSERT INTO user_pkgs(UserId,PkgId, CCStatus,ExpDate,status) VALUES(:userId, :pkgId, :CCStatus,:ExpDate,:status)";
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId, ':pkgId' => $app->package,':CCStatus' => $CCStatus, ':ExpDate' => $end, ':status' => $status ]);

        $this->insertUserGenres($userId, $app->genre);

        // $sql = "UPDATE package_reorder SET CC_Status='1',Reorder_Status='A' WHERE UserId= :userId";
        // $sth = $dbh->prepare($sql);
        // $sth->execute([':userId'=> $userId]);

        return $rv;
    }

    public function insertAuditLog(int $userId, string $action, string $actionData = null){
        $sql = 'INSERT INTO auditlog(UserId, Action, ActionData)
                    VALUES (:userId, :action, :actionData)';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':userId'=> $userId, 
                ':action'=> $action,
                ':actionData'=> $actionData
            ]);
        $rv = $dbh->lastInsertId();
        return $rv;
    }

    public function insertLog(string $title, string $description = null, 
        int $categoryId = Categories::Diagnostic, int $userId = 0, string $logData = null){
        $sql = 'INSERT INTO log(CategoryId, UserId, Title, Description, LogData)
                    VALUES (:categoryId, :userId, :title, :description, :logData)';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':categoryId'=> $categoryId,
                ':userId'=> $userId, 
                ':title'=> $title,
                ':description'=> $description,
                ':logData'=> $logData
            ]);
        $rv = $dbh->lastInsertId();
        return $rv;
    }

    public function insertNotificationRequest($notificationRequest){
        $sql = 'INSERT INTO notificationrequests(Email, Message)
                    VALUES (:email, :message)';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':email'=> $notificationRequest->email,
                ':message'=> $notificationRequest->message
            ]);
        $rv = $dbh->lastInsertId();
        return $rv;
    }

    public function insertSong($song, int $userId){
        if($song->copyrightYear == ""){
            $song->copyrightYear =date('Y');
        }else{
            $song->copyrightYear =substr($song->copyrightYear, 0, -1);
        }
        if($song->albumId == ""){
            $song->albumId=null;
            $Status = 'QA';
        }else{
            $Status = 'Inprocess';
        }
        $sql = 'INSERT INTO songs(UserId, albumId, SongFile, SongPath, SongTitle, ArtistName, Duration, Genre, SubGenre, Label, State, Country, Website, wheretobuy ,Dist_Type, Region, DJAssociation,Normal_Dist,sub_distype,fans,artist_image,`AlbumName`, `Copyright_Owner`, `Copy_Year`, SampleFile, Filename,Status,filesize)
                    VALUES (:userId,:albumId, :songFile, :songPath, :songTitle, :artistName, :duration, :genre, :subGenre, :label, :state, :country, :website, :wheretobuy ,:dist_Type, :region, :djAssociation,:normal_Dist,:sub_distype,:fans,:artist_image,:albumName, :copyright_Owner, :copy_Year, :sampleFile, :filename, :Status,:filesize)';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':userId'=> $userId, 
                ':albumId'=> $song->albumId,
                ':songFile'=> $song->SongFile,
                ':songPath'=> $song->SongPath, 
                ':songTitle'=> $song->title, 
                ':artistName'=> $song->artistName, 
                ':duration'=> $song->duration, 
                ':genre'=> '', 
                ':subGenre'=> '', 
                ':label'=> $song->label, 
                ':state'=> $song->artistCityState, 
                ':country'=> $song->artistCountry, 
                ':website'=> $song->website, 
                ':wheretobuy'=> $song->whereToBuy ,
                ':dist_Type'=> $song->distType, 
                ':region'=> $song->region, 
                ':djAssociation'=> $song->djAssociation,
                ':normal_Dist'=> $song->normalDist,
                ':sub_distype'=> $song->subDistType,
                ':fans'=> $song->fans,
                ':artist_image'=> $song->artist_image,
                ':albumName'=> $song->albumName, 
                ':copyright_Owner'=> $song->copyrightOwner, 
                ':copy_Year'=> $song->copyrightYear."-01-01", 
                ':sampleFile'=> $song->SampleFile, 
                ':filename'=> $song->file->name,
                ':Status'=> $Status,
                ':filesize'=> round($song->filesize,'2')
            ]);
        $rv = $dbh->lastInsertId();
      /* ':genre'=> $song->genre, 
        ':subGenre'=> $song->subGenre,*/ 
        return $rv;
    }

    public function insertUser(string $username, string $password,string $email, string $facebookid = null, string $recquestion = null, string $recanswer = null){
        $password = encryptText($password);
        $password = base64_encode($password);
        $dbh = $this->getDb();
        $sth = $dbh->prepare('INSERT INTO users (Username, Password, email, PwdQ, PwdA, facebook_id) VALUES(:username, :password, :email, :PwdQ, :PwdA, :facebookid)');
        $sth->execute([':username'=> $username, 
                       ':password'=> $password, 
                       ':email'=> $email,
                       ':PwdQ'=> $recquestion, 
                       ':PwdA'=> $recanswer, 
                       ':facebookid'=> $facebookid]);
        $rv = $dbh->lastInsertId();
        return $rv;
    }

    private function insertUserGenres(int $userId, array $genres){
        $dbh = $this->getDb();
        $params = $this->array_parameterize($genres);
        $inClause = 'IN (' . join(',', array_keys($params)) . ')';
        $sql = "INSERT INTO usergenres (UserId, GenresOfficialId)
                    SELECT :userId, g.Id
                    FROM genresofficial g
                    WHERE g.GroupName $inClause";
        $params[':userId'] = $userId;
        $sth = $dbh->prepare($sql);
        $sth->execute($params);
        $rv = $sth->rowCount();
        return $rv;
    }

    private function massageApplication($app) {
        if ($app) {
            if ($app->SongsReview < 0) $app->SongsReview = 10;
            if ($app->RowVersion < 1){
                //fix genre list in MusicServed
                $genres = explode('|', rtrim($app->MusicServed, '|'));
                $genresDb = $this->getGenresByNames($genres);
                $codes = array_map(function($g){return $g['Code'];}, $genresDb);
                $app->MusicServed = implode('|', $codes);
            }
        }
    }

    public function postFeedback($feedbackData, $userId){
        $dbh = $this->getDb();
        $feedback = $this->getFeedback($feedbackData->songId, $userId);
        if ($feedback){
            $sql = 'UPDATE song_feedback sf
                        SET sf.OverallRating = :overallRating,
                            sf.FeedbackGivenDate = now()
                        WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        }
        else {
            $sql = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
        }
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $feedbackData->songId, PDO::PARAM_INT);
        $sth->bindValue(':overallRating', $feedbackData->overallRating, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
  
    }
    public function postFeedbackcomment($feedbackData, $userId){
        $dbh = $this->getDb();
        $feedback = $this->getFeedback($feedbackData->songId, $userId);
        if ($feedback){
            $sql = 'UPDATE song_feedback sf
                        SET sf.Comment = :comment,
                            sf.FeedbackGivenDate = now()
                        WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        }
        else {
            $sql = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, :comment)";
        }
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $feedbackData->songId, PDO::PARAM_INT);
        $sth->bindValue(':comment', $feedbackData->comment, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
  
    }

    public function updateApplication(int $appId, array $columnValues): int {
        //print_r($appId);
        $dbh = $this->getDb();
         $sql = 'UPDATE application a ' . $this->buildSetClause($columnValues, 'a') . '
                    WHERE a.AppId = :appId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':appId', $appId, PDO::PARAM_INT);
         $this->bindSetClauseValues($columnValues, $sth);
       //print_r(get_class_methods());
       //print_r($sth->errorInfo());
        $sth->execute();
        //print_r($sth->debugDumpParams());
        //exit;
        //print_r($sth->errorInfo());
        $rv = $sth->rowCount();
        return $rv;
  
    }
    public function deleteApplicationByadmin(int $appId): int{
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM application WHERE AppId = :appId');
        $sth->execute([':appId'=> $appId]);
        return true;
    }
    
    public function updateSampleFile($songId, $sampleFilename){
        $dbh = $this->getDb();
        $sql = "UPDATE songs s
                    SET s.SampleFile = :sampleFilename
                    WHERE s.SongId = :songId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->bindValue(':sampleFilename', $sampleFilename);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
  
    }

    public function updateSong($song){
        if($song->artistImage != ""){
             $sql = 'UPDATE songs
                    SET SongTitle = :songTitle, ArtistName = :artistName, Genre = :genre, Label = :label, 
                        State = :state, Country = :country, Website = :website, wheretobuy = :wheretobuy , Dist_Type = :dist_Type, 
                        Region = :region, DJAssociation = :djAssociation, Normal_Dist = :normal_Dist, sub_distype = :sub_distype,
                        fans = :fans, artist_image = :artist_image, `AlbumName` = :albumName, `Copyright_Owner` = :copyright_Owner, `Copy_Year` = :copy_Year,
                        `Facebook_link` = :Facebook_link, `Twitter_link` = :Twitter_link, `Spotify_link` = :Spotify_link,
                         `iTunes_link` = :iTunes_link, artistcity = :artistcity
                    WHERE SongId = :songId';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':songId' => $song->songId,
                ':songTitle'=> $song->title, 
                ':artistName'=> $song->artistName, 
                ':genre'=> $song->genre[0], 
                ':label'=> $song->label, 
                ':state'=> $song->artistCityState, 
                ':country'=> $song->artistCountry, 
                ':website'=> $song->website, 
                ':wheretobuy'=> $song->whereToBuy ,
                ':dist_Type'=> $song->distType, 
                ':region'=> $song->region, 
                ':djAssociation'=> $song->djAssociation,
                ':normal_Dist'=> $song->normalDist,
                ':sub_distype'=> $song->subDistType,
                ':fans'=> $song->fans,
                ':artist_image'=> $song->artistImage,
                ':albumName'=> $song->albumName, 
                ':copyright_Owner'=> $song->copyrightOwner, 
                ':copy_Year'=> $song->copyrightYear."-01-01", 
                ':Facebook_link'=> $song->Facebook_link, 
                ':Twitter_link'=> $song->Twitter_link,
                ':Spotify_link'=> $song->Spotify_link, 
                ':iTunes_link'=> $song->iTunes_link,
                ':artistcity'=> $song->artistCity,
            ]);
        $rv = $sth->rowCount();
        }else{
             $sql = 'UPDATE songs
                    SET SongTitle = :songTitle, ArtistName = :artistName, Genre = :genre, Label = :label, 
                        State = :state, Country = :country, Website = :website, wheretobuy = :wheretobuy , Dist_Type = :dist_Type, 
                        Region = :region, DJAssociation = :djAssociation, Normal_Dist = :normal_Dist, sub_distype = :sub_distype,
                        fans = :fans, `AlbumName` = :albumName, `Copyright_Owner` = :copyright_Owner, `Copy_Year` = :copy_Year,
                        `Facebook_link` = :Facebook_link, `Twitter_link` = :Twitter_link, `Spotify_link` = :Spotify_link,
                         `iTunes_link` = :iTunes_link, artistcity = :artistcity
                    WHERE SongId = :songId';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':songId' => $song->songId,
                ':songTitle'=> $song->title, 
                ':artistName'=> $song->artistName, 
                ':genre'=> $song->genre[0], 
                ':label'=> $song->label, 
                ':state'=> $song->artistCityState, 
                ':country'=> $song->artistCountry, 
                ':website'=> $song->website, 
                ':wheretobuy'=> $song->whereToBuy ,
                ':dist_Type'=> $song->distType, 
                ':region'=> $song->region, 
                ':djAssociation'=> $song->djAssociation,
                ':normal_Dist'=> $song->normalDist,
                ':sub_distype'=> $song->subDistType,
                ':fans'=> $song->fans,
                ':albumName'=> $song->albumName, 
                ':copyright_Owner'=> $song->copyrightOwner, 
                ':copy_Year'=> $song->copyrightYear."-01-01", 
                ':Facebook_link'=> $song->Facebook_link, 
                ':Twitter_link'=> $song->Twitter_link,
                ':Spotify_link'=> $song->Spotify_link, 
                ':iTunes_link'=> $song->iTunes_link,
                ':artistcity'=> $song->artistCity,
            ]);
        $rv = $sth->rowCount();
        }
       
        /*$sth->debugDumpParams();
        exit;*/
        return $rv;
    }

    public function updateSongDistributionDates($userId){
        $dbh = $this->getDb();
        $sql = "UPDATE songs s
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
      
    }

    public function updateUser(int $userId, array $columnValues): int {
        if (array_key_exists('Password', $columnValues)){
            //upgrade row version and encode password
            //$columnValues['RowVersion'] = 1;
            $columnValues['Password'] = base64_encode(encryptText($columnValues['Password']));
        }

        $dbh = $this->getDb();
        $sql = 'UPDATE users u ' . $this->buildSetClause($columnValues, 'u') . '
                    WHERE u.UserId = :userId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $this->bindSetClauseValues($columnValues, $sth);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
    }

    public function userExists(string $username){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('SELECT COUNT(*) AS total FROM users WHERE username = :username');
        $sth->execute([':username'=> $username]);
        $rv = $sth->fetchObject();
        return $rv->total > 0;
    }

    
    public function getapplicationsUserCount(){
        $dbh = $this->getDb();
        $sql = 'SELECT COUNT(*) total
                    FROM application a';
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }
    public function getallSongsCount(){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total
                    FROM songs s
                    WHERE s.Status = 'A'";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }
    public function getallArtistCount(){
        $dbh = $this->getDb();
        $sql = "SELECT *
                    FROM songs s
                    WHERE s.Status = 'A' GROUP by ArtistName";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
    }

    public function insertfbUser(string $username, string $name, string $facebook_id){
        //$password = encryptText($password);
        //$password = base64_encode($password);
       
        $dbh = $this->getDb();
        $sth = $dbh->prepare('INSERT INTO users (Username, facebook_id) VALUES(:username, :facebook_id)');
        $sth->execute([':username'=> $username, ':facebook_id'=> $facebook_id]);
        $rv = $dbh->lastInsertId();

        return $rv;
    }
    public function updatefbUser(string $userId,string $username, string $name, string $facebook_id){
       echo $sql="UPDATE users SET Username = :username, facebook_id = :facebook_id where UserId = :userId";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute([':username'=> $username, ':facebook_id'=> $facebook_id, ':userId'=> $userId,]);
        $rv = $sth->fetchObject();

        return $rv;
    }
    public function checkfbUser(string $username, string $facebook_id){

        $sql = "SELECT UserId
                    FROM users
                    WHERE  facebook_id = :facebook_id";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute([':facebook_id'=> $facebook_id]);
        //$sth->execute();
        $rv = $sth->fetchObject();
        
        return $rv->UserId;
    }
    public function insertfbApplication($email,$name,$userId,$conf_uid){

        $sql = "INSERT INTO application (UserId, FirstName, Email, AppConfirmUID,DOB, AppDate, Approval_Status)";
        $sql .= " VALUES (:userId, :firstName, :email,  :appConfirmUid, :date ,NOW(), 'P')"; 
        //$stateOrProvince = $app->country == 'US' ? $app->state : $app->city;

        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':userId'=> $userId, 
                ':firstName'=> $name,
                ':email'=> $email, 
                ':appConfirmUid'=> $conf_uid,
                ':date'=>date('Y-m-d')
            ]);
        $rv = $dbh->lastInsertId();

        $sql = "INSERT INTO user_pkgs(UserId,PkgId, CCStatus,ExpDate) VALUES(:userId,'111', '1',:expdate)";
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId,'expdate'=>date('Y-m-d')]);

       // $this->insertUserGenres($userId, $app->genre);

        // $sql = "UPDATE package_reorder SET CC_Status='1',Reorder_Status='A' WHERE UserId= :userId";
        // $sth = $dbh->prepare($sql);
        // $sth->execute([':userId'=> $userId]);

        return $rv;
    }


    public function getapplicationpackageByUserId(int $userId)
    {
        $dbh = $this->getDb();

       $sql = "SELECT up.Id,
                      up.UserId,
                      ap.PkgId,
                      ap.PkgType,
                      ap.PkgName,
                      ap.PkgDetail,
                      ap.Price,
                      ap.Songs,
                      ap.DistributionPct,
                      ap.DistributionMin
                      FROM user_pkgs up
                      JOIN  account_packages ap ON ap.PkgId = up.PkgId
                      WHERE up.UserId= :userId and up.status = 'A' ";
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }
     public function getSonguploadsCountByUser(int $userId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total 
                    FROM  songs s
                    WHERE s.UserId = :userId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }
     public function getsonguploadsRemainingCountByUser(int $userId){
        $dbh = $this->getDb();

        /*$sql = 'SELECT  PromoSongs
                    FROM `application` WHERE UserId= :userId';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        $PromoSongs=$rv->Songs;*/

        $sql1 = "SELECT ap.Songs FROM user_pkgs up
                      JOIN  account_packages ap ON ap.PkgId = up.PkgId
                      WHERE up.UserId= :userId and up.status = 'A'";
                    
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([':userId'=> $userId]);
        $rv1 = $sth1->fetchObject();
        $packagesong=$rv1->Songs;

        /*$sql2 = "SELECT COUNT(*) total 
                    FROM  songs s
                    WHERE s.UserId = :userId and (Status = 'A' or Status = 'QA'  or Status = 'Inprocess' )";*/
        $sql2 = "SELECT  sum(filesize) total 
                    FROM  songs s
                    WHERE s.UserId = :userId and (Status = 'A' or Status = 'QA'  or Status = 'Inprocess' )";   
        $sth2 = $dbh->prepare($sql2);
        $sth2->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth2->execute();
        $rv2 = $sth2->fetchObject();
        $totalsongs=$rv2->total;

        //$ttl= $packagesong + $PromoSongs - $totalsongs;
        $ttl= $packagesong - $totalsongs;
        if($ttl > 0){
            $ttl =round($ttl,'2');
        }else{
            $ttl = 0;
        }
        return $ttl;
    }
    public function getdeletesongs(int $userId,int $songId){
        $dbh = $this->getDb();
        $update_song = $dbh->prepare("UPDATE songs SET Status= 'D' where SongId = '".$songId."'");
        $update_song->execute();

        /*$del_feedback = $dbh->prepare("DELETE from Song_Feedback where SongId = '".$songId."'");
        $del_feedback->execute();
        $del_distribution = $dbh->prepare("DELETE from Song_Distribution where SongId = '".$songId."'");
        $del_distribution->execute();
        $del_song = $dbh->prepare("DELETE from Songs where SongId = '".$songId."'");
        $del_song->execute();
        $del_crate = $dbh->prepare("DELETE from DJCrate  where SongId = '".$songId."'");
        $del_crate->execute();
        $update_song_limit = $dbh->prepare("Update  Application set songlimit=songlimit-1 where UserId = '".$userId."'");
        $update_song_limit->execute();
        $del_message = $dbh->prepare("DELETE from messages   where song_id = '".$songId."'");
        $del_message->execute();
            */
        return "success";
    }
     public function geteditsongbyuser(int $userId,int $songId){
        $dbh = $this->getDb();
        $dbh = $this->getDb();
        $sql = "SELECT SongId, UserId, SongFile, SongPath, SongTitle, ArtistName, Duration, Genre, SubGenre, Label, State, Country, Website, CD, Vinyl, MIDownload, Status, tire2status, Region, Dist_Type, DJAssociation, Normal_Dist, DistDate, artist_image, AlbumName, Copyright_Owner, Year(Copy_Year) as Copy_Year, wheretobuy, sub_distype, fans, SampleFile, Filename,Facebook_link,Twitter_link,Spotify_link,iTunes_link FROM songs WHERE SongId = :songId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getupdateGeneralinfo($appGeneralinfo){

        if($appGeneralinfo->imageInput != ""){
             $sql = 'UPDATE application
                    SET FirstName = :FirstName,
                        LastName = :LastName,
                        StateOrProvince = :StateOrProvince,
                        Country = :Country, 
                        DOB = :DOB, 
                        Email = :Email,
                        Gender = :Gender,
                        profile_pic = :profile_pic,
                        bio = :bio,
                        facebook= :facebook,
                        twitter= :twitter,
                        instagram= :instagram,
                        youtube= :youtube 
                    WHERE AppId = :appid';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':appid' => $appGeneralinfo->appid,
                ':FirstName'=> $appGeneralinfo->FirstName, 
                ':LastName'=> $appGeneralinfo->LastName, 
                ':StateOrProvince'=> $appGeneralinfo->StateOrProvince,
                ':Country'=> $appGeneralinfo->Country,
                ':DOB'=> $appGeneralinfo->DOB,
                ':Email'=> $appGeneralinfo->Email,
                ':Gender'=> $appGeneralinfo->gender, 
                ':profile_pic'=> $appGeneralinfo->imageInput, 
                ':bio'=> $appGeneralinfo->description,
                ':facebook'=> $appGeneralinfo->facebook,
                ':twitter'=> $appGeneralinfo->twitter,
                ':instagram'=> $appGeneralinfo->instagram,
                ':youtube'=> $appGeneralinfo->youtube,   
            ]);
        $rv = $sth->rowCount();
        }else{
             $sql = 'UPDATE application
                    SET FirstName = :FirstName,
                        LastName = :LastName,
                        StateOrProvince = :StateOrProvince,
                        Country = :Country, 
                        DOB = :DOB, 
                        Email = :Email,
                        Gender = :Gender,
                        bio = :bio,
                        facebook= :facebook,
                        twitter= :twitter,
                        instagram= :instagram,
                        youtube= :youtube 
                    WHERE AppId = :appid';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':appid' => $appGeneralinfo->appid,
                ':FirstName'=> $appGeneralinfo->FirstName, 
                ':LastName'=> $appGeneralinfo->LastName, 
                ':StateOrProvince'=> $appGeneralinfo->StateOrProvince,
                ':Country'=> $appGeneralinfo->Country,
                ':DOB'=> $appGeneralinfo->DOB,
                ':Email'=> $appGeneralinfo->Email,
                ':Gender'=> $appGeneralinfo->gender, 
                ':bio'=> $appGeneralinfo->description,
                ':facebook'=> $appGeneralinfo->facebook,
                ':twitter'=> $appGeneralinfo->twitter,
                ':instagram'=> $appGeneralinfo->instagram,
                ':youtube'=> $appGeneralinfo->youtube,   
            ]);
        $rv = $sth->rowCount();
        }
        /*$sth->debugDumpParams();

        exit;*/
        return $rv;
        
    }
        public function getupdateGetmusic($userId,$appGetmusicinfo){
        $MusicServed=implode("|", $appGetmusicinfo->MusicServed);
       
        $sql = 'UPDATE application
                    SET SongsReview = :SongsReview,
                        MusicServed = :MusicServed
                        WHERE AppId = :appid';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':appid' => $appGetmusicinfo->appid,
                ':SongsReview'=> $appGetmusicinfo->SongsReview, 
                ':MusicServed'=> $MusicServed, 
            ]);
        $rv = $sth->rowCount();

        $del_UserGenres = $dbh->prepare("DELETE from usergenres where UserId = '".$userId."'");
        $del_UserGenres->execute();
        
       /* $params = $this->array_parameterize($appGetmusicinfo->MusicServed);
        echo $inClause = 'IN (' . join(',', array_values($params)) . ')';

        echo $sql1 = "INSERT INTO UserGenres (UserId, GenresOfficialId)
                    SELECT :userId, g.Id
                    FROM GenresOfficial g
                    WHERE g.GroupName $inClause";
        exit;
        $params[':userId'] = $userId;
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute($params);
        $rv1 = $sth1->rowCount();*/
        //return $rv;
        $this->insertUserGenres($userId, $appGetmusicinfo->MusicServed);
        return $rv;
        
    }
    public function getFrontsongs(int $skip, int $take, string $searchval){
        $dbh = $this->getDb();
        /*$sql = "SELECT s.* FROM Songs s 
                    WHERE s.Status = 'A'
                    LIMIT :skip, :take";*/
       $sql ="SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename FROM songs s 
             JOIN genresofficial Go ON Go.Id = s.Genre 
              WHERE s.Status = 'A' and ( s.SongTitle like '%".$searchval."%' or Go.Name like '%".$searchval."%' ) LIMIT :skip, :take";

        
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getFrontsongsCount(string $searchval){
        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    WHERE s.Status = 'A' and (s.SongTitle like '%".$searchval."%' or Go.Name like '%".$searchval."%')";
       
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        
        return $rv->total;
    }
    public function getFrontallsongs(int $skip, int $take){
        $dbh = $this->getDb();
       
            $sql ="SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename FROM songs s 
             JOIN genresofficial Go ON Go.Id = s.Genre 
              WHERE s.Status = 'A'  LIMIT :skip, :take";
       
        
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getFrontallsongsCount(){
        $dbh = $this->getDb();
       
             $sql = "SELECT COUNT(*) total
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    WHERE s.Status = 'A' ";
       
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        
        return $rv->total;
    }
     public function getSong_Distribution(int $songId, int $userId){
        $dbh = $this->getDb();
        $sql = 'SELECT *
                    FROM song_distribution sf
                    WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getaddSongToListeningRoom(int $userId,int $songId){

        $dbh = $this->getDb();
        $getdist = $this->getSong_Distribution($songId, $userId);
        if ($getdist){
             $sql = 'UPDATE song_distribution sd
                        SET sd.DistDate = now(),
                            sd.FeedbackDate=now()
                        WHERE sd.DJUserId = :userId AND sd.SongId = :songId';
        }else{
             $sql = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate) VALUES (:userId, :songId, now(), now())";
        }
       
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':userId' => $userId,
                ':songId'=> $songId, 
                ]);
        $rv = $sth->rowCount();

        $sql1 = "UPDATE Songs s
                    JOIN song_distribution sd ON sd.SongId = :songId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':userId' => $userId,
                ':songId'=> $songId, 
                ]);
        $rv1 = $sth1->rowCount();
        
        $feedback = $this->getFeedback($songId, $userId);
        if ($feedback){
            $sql2 = 'UPDATE song_feedback sf
                        SET sf.OverallRating = :overallRating,
                            sf.FeedbackGivenDate = now()
                        WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        }else{
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
        }
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $userId,
                ':songId'=> $songId, 
                ':overallRating'=> 0, 
                ]);
        $rv2 = $sth2->rowCount();
        return $rv2;

    }
    public function getsongFeedback(int $songId, int $userId){
        $dbh = $this->getDb();
        $sql = 'SELECT *
                    FROM song_feedback sf
                    WHERE sf.DJUserId = :userId and sf.OverallRating > 0 AND sf.SongId = :songId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function geteditSongFeedback(int $userId, int $songId){
        $dbh = $this->getDb();
        $sql = 'SELECT SongId,Id,OverallRating,Comment
                    FROM song_feedback WHERE DJUserId = :userId and SongId = :songId';
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getpostMessage($from_user,$to_user,$songId,$subject,$messsage){
        $dbh = $this->getDb();
        $strtotime=strtotime(date("Y-m-d h:i:s"));
        $sql = 'INSERT INTO `messages`(`from_id`, `to_id`, `song_id`, `send_date`, `subject`, `message_content`) VALUES (:from_user, :to_user, :songId, :strtotime ,:subject, :messsage)';
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':from_user' => $from_user,
                ':to_user'=> $to_user, 
                ':songId'=> $songId,
                ':strtotime'=>$strtotime,
                ':subject'=> $subject,
                ':messsage'=> $messsage, 
                ]);
        //$rv = $sth->fetchObject();
        $rv = $sth->rowCount();
        return $rv;
    }
    public function getpromember($user_id){
        $dbh = $this->getDb();
         $sql = "SELECT * FROM user_pkgs up 
         INNER JOIN account_packages ap ON ap.PkgId=up.PkgId 
         WHERE ap.Price > 0 and ap.PkgDetail LIKE '%Record Drop Pro%' and up.UserId = :user_id and up.status = 'A'";
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':user_id' => $user_id,
                ]);
        //$rv = $sth->fetchObject();
        $rv = $sth->rowCount();
        return $rv;

    }
    public function getFavouriteMember($user_id){
        $dbh = $this->getDb();
        /* $sql = "SELECT 
                    ap.UserId as id,
                    ap.FirstName as name                   
                    FROM songs s join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes'
                    JOIN Application ap ON  ap.UserId = dj.DJUserId  WHERE  s.UserId = :user_id";*/
        $sql= "SELECT ap.UserId as id, ap.Username as name FROM songs s join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes' JOIN users ap ON ap.UserId = dj.DJUserId WHERE s.UserId = :user_id group by ap.UserId";
                    
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':user_id', $user_id);
        $sth->execute();
        //$rv = $sth->fetchObject();
        //$rv = $sth->fetchObject();
         $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        
        return $rv;

    }
    public function getFavouriteMemberStateOrProvinance($user_id){
        $dbh = $this->getDb();
         $sql = "SELECT st.State_Abbr as id, st.State as name 
                 FROM songs s join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes' 
                 JOIN application ap ON ap.UserId = dj.DJUserId 
                 join states st on ap.StateOrProvince = st.State_Abbr 
                 WHERE s.UserId = :user_id and ap.StateOrProvince != '' group by ap.StateOrProvince";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':user_id', $user_id);
        $sth->execute();
        //$rv = $sth->fetchObject();
        //$rv = $sth->fetchObject();
         $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        
        return $rv;

    }
    
    public function getsubmitdistribution($songid,$normal_dist,$dist_type,$sub_distype,$fansfav,$Region){
        /*print_r($song);
        echo $user_id;
        exit;*/
        $sql = 'UPDATE songs
                    SET  Dist_Type = :dist_Type, 
                         Normal_Dist = :normal_Dist,
                         sub_distype = :sub_distype,
                         fans = :fans,
                         Region = :region 
                         WHERE SongId = :songId';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':songId' => $songid,
                ':dist_Type'=> $dist_type, 
                ':normal_Dist'=> $normal_dist,
                ':sub_distype'=> $sub_distype,
                ':fans'=> $fansfav,
                ':region'=> $Region,
                
            ]);
        $rv = $sth->rowCount();
        
        return $rv;
        
        
    }
    public function SongApprove($filterby,int $skip, int $take){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        /*$sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM Songs s
                    JOIN GenresOfficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    WHERE s.Status='QA' group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";*/
       if( $filterby == "Pending" ){
            $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name   Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    WHERE s.Status='QA' group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "All" ){
             $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId  , avg(sf.OverallRating) as OverallRating 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId 
                    group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "Rated" ) {
            $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId , avg(sf.OverallRating) as OverallRating 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId 
                    where sf.OverallRating > 0 and sf.SongId = s.SongId
                    group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "Unrated" ) {
            $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId , avg(sf.OverallRating) as OverallRating 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId 
                    where s.SongId NOT IN (SELECT SongId FROM `song_feedback`)
                    group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "Approved" ) {
           $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name   Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId , avg(sf.OverallRating) as OverallRating 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId 
                    WHERE s.Status='A' group by s.SongId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "Rejected" ) {
           $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name   Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId  , avg(sf.OverallRating) as OverallRating 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId 
                    WHERE s.Status='D' group by new_albumId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }elseif ( $filterby == "Expired" ) {
           $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId , avg(sf.OverallRating) as OverallRating , count(sf.Id) as NoOfRaters 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    LEFT JOIN song_feedback sf on sf.SongId = s.SongId
                    where s.SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) > '".$DISTRIBUTION_VALUE."')
                    group by s.SongId  order by s.SongId DESC
                    LIMIT :skip, :take";
        }
                    
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function SongApproveCount($filterby){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
       /* $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId FROM Songs s 
                    JOIN GenresOfficial Go ON Go.Id = s.Genre 
                    where s.Status='QA' group by new_albumId ";*/
        if( $filterby == "Pending" ){
            $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    where s.Status='QA' group by new_albumId ";
        }elseif ( $filterby == "All" ){
            $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    group by new_albumId ";
        }elseif ( $filterby == "Rated" ) {
            $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    JOIN song_feedback sf on sf.SongId = s.SongId
                    where sf.OverallRating > 0 and sf.SongId = s.SongId
                    group by s.SongId ";
        }elseif ( $filterby == "Unrated" ) {
            $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    where s.SongId NOT IN (SELECT SongId FROM `song_feedback`) 
                    group by new_albumId ";
        }elseif ( $filterby == "Approved" ) {
           $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    where s.Status='A' group by new_albumId ";
        }elseif ( $filterby == "Rejected" ) {
           $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    where s.Status='D' group by new_albumId ";
        }
        elseif ( $filterby == "Expired" ) {
           $sql = "SELECT COUNT(*) total , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    where s.SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) > '".$DISTRIBUTION_VALUE."') 
                    group by new_albumId ";
        }
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        //return $rv->total;
        $sth->execute();
        // $rv = $sth->fetchObject();
        $count = $sth->rowCount();
        //return $rv->total;
         return $count;
       
    }
    
    public function getApprovesong($songId){

        $sql = "UPDATE songs SET  Status = 'A' WHERE SongId = $songId";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
       
        return $rv;
    }
    public function setDistDatesong($songId){
        $sql = "UPDATE songs SET  Distdate=now() WHERE SongId = $songId";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
    }

    
    public function getRejectsong($songId){

        $sql = "UPDATE songs
                    SET  Status = 'D' 
                         WHERE SongId = $songId";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
       
        return $rv;
    }
    public function getGlobalSetting(){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM global_setting";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
       
    }
    public function getSongfordistribute($songId){
        $dbh = $this->getDb();
        $sql = "SELECT *, genresofficial.Name as Genername FROM songs
         INNER JOIN genresofficial on genresofficial.Id = songs.Genre  where SongId=$songId and status = 'A'";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
       
    }
    public function checksongreviewlimit($UserId,$month,$year){
        $dbh = $this->getDb();
        $sql = "SELECT count(a.SongId) total FROM song_distribution a WHERE a.DJUserId = '".$UserId."' AND month( a.DistDate ) = '".$month."' AND year( a.DistDate ) = '".$year."'";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function getUsersfordistribute($UserId,$normal_dist,$Dist_Type,$sub_distype,$fanlist,$gengroup,$Region,$DISTRIBUTION_VALUE){
        $dbh = $this->getDb();
        if($normal_dist == 'Y' || $Dist_Type == 'Random')
        {
            $sql="SELECT application.UserId,Application.Email ,Application.SongsReview 
                  FROM application 
                  where Approval_STATUS = 'A'  AND  
                        application.MusicServed LIKE '%".$gengroup."%' 
                  GROUP BY application.UserId
                  ORDER BY rand( ) LIMIT 0,".$DISTRIBUTION_VALUE." ";
        }else if( $Dist_Type == 'Favourite'){
            if($sub_distype=="Allfans")
            {
                $sql = "SELECT ap.UserId, ap.Email,ap.SongsReview FROM songs s 
                        join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes'
                        JOIN application ap ON  ap.UserId = dj.DJUserId  WHERE  s.UserId = $UserId";

            }elseif ($sub_distype=="Individual") 
            {
                $sql = "SELECT ap.UserId, ap.Email,ap.SongsReview FROM  
                                application ap   
                        WHERE   ap.UserId in (".$fanlist.")";
            }elseif ($sub_distype=="Regions") 
            {
                $sql = "SELECT ap.UserId, ap.Email,ap.SongsReview 
                 FROM songs s join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes' 
                 JOIN application ap ON ap.UserId = dj.DJUserId 
                 join states st on ap.StateOrProvince = st.State_Abbr 
                 WHERE s.UserId = $UserId and ap.StateOrProvince in ('".$Region."')";
               
            }
        }
        

        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        //print_r($rv);

        return $rv;
    }
    public function insertindistribute(int $userId,int $songId){

        $dbh = $this->getDb();
        $getdist = $this->getSong_Distribution($songId, $userId);
        if ($getdist){
             $sql = 'UPDATE song_distribution sd
                        SET sd.DistDate = now(),
                            sd.FeedbackDate=now()
                        WHERE sd.DJUserId = :userId AND sd.SongId = :songId';
        }else{
             $sql = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate) VALUES (:userId, :songId, now(), now())";
        }
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':userId' => $userId,
                ':songId'=> $songId, 
                ]);
        $rv = $sth->rowCount();

        $feedback = $this->getFeedback($songId, $userId);
        if ($feedback){
            $sql2 = 'UPDATE song_feedback sf
                        SET sf.OverallRating = :overallRating,
                            sf.FeedbackGivenDate = now()
                        WHERE sf.DJUserId = :userId AND sf.SongId = :songId';
        }else{
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
        }
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $userId,
                ':songId'=> $songId, 
                ':overallRating'=> 0, 
                ]);
        $rv2 = $sth2->rowCount();
        //return $rv2;
    }

    public function getsongreviewedcount($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                WHERE sf.OverallRating > 0 and sf.SongId = ".$songId." and s.UserId=".$userId."";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function getsongcrateaddedcount($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM djcrate dj 
                join songs s on dj.SongId=s.SongId 
                WHERE dj.SongId = ".$songId." and s.UserId=".$userId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function getsongcrateaddedcountinuser($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM djcrate dj 
                WHERE dj.SongId = ".$songId." and dj.DJUserId=".$userId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }

    
    public function getsongfavouriteaddedcount($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM djcrate dj 
                join songs s on dj.SongId=s.SongId 
                WHERE dj.favourite='Yes' and  dj.SongId = ".$songId." and s.UserId=".$userId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }

    public function getSongFeedbackinfo($userId,$songId){
        //,$skip, $take
        $dbh = $this->getDb();
        /*$sql = "SELECT u.UserId, u.Username, sf.OverallRating, sf.Comment, 
                c.country_name as Country, st.State as StateOrProvince ,a.City 
                FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                join users u on sf.DJUserId=u.UserId 
                join application a on u.UserId = a.UserId 
                join  country c on a.Country = c.country_code
                join states st on a.StateOrProvince= st.State_Abbr
                WHERE sf.SongId = '".$songId."' and s.UserId='".$userId."' LIMIT ".$skip.",".$take.""; */
        $sql = "SELECT u.UserId, u.Username, sf.OverallRating, sf.Comment, 
                c.country_name as Country, st.State as StateOrProvince ,a.City 
                FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                join users u on sf.DJUserId=u.UserId 
                join application a on u.UserId = a.UserId 
                join  country c on a.Country = c.country_code
                join states st on a.StateOrProvince= st.State_Abbr
                WHERE sf.OverallRating > 0 and sf.SongId = '".$songId."' and s.UserId='".$userId."'
                 ORDER BY Country ASC, StateOrProvince ASC , a.City ASC, u.Username ASC";
              
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    public function getSongFeedbackinfocount($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                WHERE  sf.OverallRating > 0 and sf.SongId = '".$songId."' and s.UserId='".$userId."'";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function getSongpostMessage($from_user,$to_user,$songId,$subject,$messsage){
        $dbh = $this->getDb();
        $strtotime=strtotime(date("Y-m-d h:i:s"));
        $to_userss=explode(',', $to_user);
       
        for($i = 0; $i < count($to_userss); $i++) {
           // echo $to_userss[$i];
            $sql = 'INSERT INTO `messages`(`from_id`, `to_id`, `song_id`, `send_date`, `subject`, `message_content`) VALUES (:from_user, :to_user, :songId, :strtotime ,:subject, :messsage)';
            $sth = $dbh->prepare($sql);
            $sth->execute([
                ':from_user' => $from_user,
                ':to_user'=> $to_userss[$i], 
                ':songId'=> $songId,
                ':strtotime'=>$strtotime,
                ':subject'=> $subject,
                ':messsage'=> $messsage, 
                ]);
            $rv = $sth->rowCount();
        }
 
        return $rv;
    }
    public function getSendGeolocationMessage($from_user,$region,$songId,$subject,$messsage){
        $dbh = $this->getDb();
        $strtotime=strtotime(date("Y-m-d h:i:s"));
        $to_userss=explode(',', $to_user);
        $sql = "SELECT ap.UserId 
                 FROM songs s join djcrate dj on dj.SongId = s.SongId and dj.favourite ='Yes' 
                 JOIN application ap ON ap.UserId = dj.DJUserId 
                 join states st on ap.StateOrProvince = st.State_Abbr 
                 WHERE s.UserId = $from_user and s.SongId = $songId and ap.StateOrProvince in ('".$region."')";

                 
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($rv as $rvvalue) {
            $to_user=$rvvalue['UserId'];
            $sql = 'INSERT INTO `messages`(`from_id`, `to_id`, `song_id`, `send_date`, `subject`, `message_content`) VALUES (:from_user, :to_user, :songId, :strtotime ,:subject, :messsage)';
            $sth = $dbh->prepare($sql);
            $sth->execute([
                ':from_user' => $from_user,
                ':to_user'=> $to_user, 
                ':songId'=> $songId,
                ':strtotime'=>$strtotime,
                ':subject'=> $subject,
                ':messsage'=> $messsage, 
                ]);
            $rv = $sth->rowCount();
        }
        return $rv;
    }

    public function getAdminuser(int $skip, int $take){
        $dbh = $this->getDb();
        $sql = "SELECT UserId,Username,admin_status,email FROM `users` WHERE `admin_status` != 0 
                    LIMIT :skip, :take";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getAdminuserCount(){
        $dbh = $this->getDb();
        $sql = 'SELECT COUNT(*) total FROM `users` WHERE `admin_status` != 0 ';
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }


    public function addadminuser(string $username, string $password, string $admin_status,string $email){
        $password = encryptText($password);
        $password = base64_encode($password);
        $dbh = $this->getDb();
        if($this->getUser($username)){
            return false;
        }else{
            $sql = 'INSERT INTO users (Username, Password, admin_status,email)
                    VALUES (:username, :password, :admin_status,:email)';
            $sth = $dbh->prepare($sql);
            $sth->execute([
                    ':username' => $username,
                    ':password'=> $password, 
                    ':admin_status'=> $admin_status,
                    ':email'=> $email,
                    ]);
            $rv = $dbh->lastInsertId();
            return true;
        }
        
    }
    public function getadmindetails($userId){
        $dbh = $this->getDb();
        $sql = "SELECT UserId,Username,admin_status,email FROM `users` WHERE `UserId` = $userId ";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function editadminuser(string $userId, string $username, string $admin_status, string $email,string $password)
    {
        $dbh = $this->getDb();
        if($password !="")
        {
            $password = encryptText($password);
            $password = base64_encode($password);
            $sql ="UPDATE users SET Username= '".$username."',Password='".$password."',
            admin_status='".$admin_status."',email='".$email."' where  UserId = $userId";
        }else{
            $sql ="UPDATE users SET Username=  '".$username."',admin_status='".$admin_status."',email='".$email."' 
                                   where  UserId = $userId";
        }

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $dbh->lastInsertId();
        return true;
    }
    public function getdeleteadminuser($userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM users WHERE UserId = :userId');
        $sth->execute([':userId'=> $userId]);
        return true;
    }
    public function checksharemycrate($from_userId,$to_userId){
        $dbh = $this->getDb();
        $sql = "SELECT * from  songcrate where  from_userid = :from_userId and to_userid =:to_userId and status !='Denied'";
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':from_userId' => $from_userId,
                ':to_userId'=> $to_userId
                ]);
        $rv = $sth->fetchObject();
        return $rv;
        
    }

    public function getsharemycrate($from_userId,$to_userId){
        $dbh = $this->getDb();
        $sql = 'INSERT INTO songcrate (from_userid, to_userid, status)
                    VALUES (:from_userId, :to_userId, :status)';
        $sth = $dbh->prepare($sql);
        $sth->execute([
                ':from_userId' => $from_userId,
                ':to_userId'=> $to_userId, 
                ':status'=> 'Pending'
                ]);
        $rv = $dbh->lastInsertId();
        return true;
        
    }

    public function getSongcratefriendsinfo($userid,$skip,$take){
        $dbh = $this->getDb();
       /* $sql = "SELECT sc.crate_id,u.UserId,u.Username,sc.created_date,sc.status 
                FROM songcrate sc 
                join users u on sc.to_userid = u.UserId   
                WHERE sc.status = 'Approved' and (sc.to_userid = $userid or sc.from_userid =  $userid) LIMIT $skip, $take";*/

        /*$sql = "SELECT sc.crate_id,u.UserId,u.Username,sc.created_date,sc.status 
                FROM songcrate sc 
                join users u on sc.from_userid = u.UserId   
                WHERE sc.status = 'Approved' and sc.to_userid = $userid  LIMIT $skip, $take";*/
        $sql="SELECT UserId,Username from users where userId in ( SELECT if(from_userid=$userid , to_userid,if(to_userid=$userid,from_userid,to_userid)) as friend_id FROM `songcrate` s WHERE (`from_userid` = $userid or `to_userid` = $userid) and status='Approved') LIMIT $skip, $take";        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
      public function getSongcratefriendsinfoCount($userid){
        
        $dbh = $this->getDb();
        $sql="SELECT COUNT(*) total from users where userId in ( SELECT if(from_userid=$userid , to_userid,if(to_userid=$userid,from_userid,to_userid)) as friend_id FROM `songcrate` s WHERE (`from_userid` = $userid or `to_userid` = $userid) and status='Approved')";
        
         /*$sql = "SELECT COUNT(*) total FROM songcrate WHERE status = 'Approved' and 
         to_userid = ".$userid."";*/

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }

    public function getPendingSongcratefriendsinfo($userid,int $skip, int $take){
        $dbh = $this->getDb();
        $sql = "SELECT sc.crate_id,u.UserId,u.Username,sc.created_date,sc.status ,sc.block_status
                FROM songcrate sc 
                join users u on sc.from_userid = u.UserId 
                WHERE sc.status = 'Pending' and sc.to_userid = ".$userid." LIMIT $skip, $take";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getPendingSongcratefriendsinfoCount($userid){

        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total FROM songcrate WHERE status = 'Pending' and to_userid = ".$userid;
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }


    public function getSongcraterequests($userid,int $skip, int $take)
    {
        $dbh = $this->getDb();
        $sql = "SELECT sc.crate_id,u.UserId,u.Username,sc.created_date,sc.status 
                FROM songcrate sc 
                join users u on sc.to_userid = u.UserId 
                WHERE sc.from_userid = ".$userid." LIMIT $skip, $take";
              
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getSongcraterequestCounts($userid){

        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total FROM `songcrate` WHERE from_userid = ".$userid;
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
    }
    public function getactionrequestsongcrate($crateid,$status,$block_status)
    {
        $dbh = $this->getDb();
        $sql ="UPDATE songcrate SET status='".$status."', block_status='".$block_status."'  where  crate_id = $crateid";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $dbh->lastInsertId();
        return true;
    }
    public function checksongcrate($crate_id){
        $dbh = $this->getDb();
        $sql = "SELECT * from  songcrate where  crate_id = $crate_id";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
        
    }
      public function getSongcratecurrentuserinfo($userId){
        $dbh = $this->getDb();

       $sql = 'SELECT app.UserId, 
                      u.Username, 
                      app.FirstName, 
                      app.LastName, 
                      c.country_name, 
                      s.State, 
                      app.City, 
                      app.Gender, 
                      app.Email, 
                      app.DOB,
                      app.MusicServed FROM `application` app 
                      join users u on app.UserId = u.UserId 
                      JOIN country c on app.Country=c.country_code 
                      join states s on app.StateOrProvince = s.State_Abbr
                    WHERE app.UserId= :userId';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }

        public function getcrateuserSongs($userId,$skip,$take){
        $dbh = $this->getDb();
        $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       sg.Name SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN subgenres sg ON sg.Id = s.SubGenre
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    LEFT JOIN  users u on s.UserId = u.UserId
                    WHERE djc.DJUserId = ".$userId."
                    group by new_albumId order by djc.Id DESC LIMIT ".$skip.", ".$take."";
                    
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getcrateuserSongsCount($userId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total  , IFNULL(s.albumId,RAND()) as new_albumId FROM djcrate djc 
                    JOIN  songs s ON djc.SongId = s.SongId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN subgenres sg ON sg.Id = s.SubGenre
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId =  $userId group by new_albumId";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $count = $sth->rowCount();
        return $count;
       
    }
      public function getinsertalbuminfo($albuminfo,$userId){

        $sql = 'INSERT INTO album (album_type, album_name, album_image,album_image_path,userId,genre)
                    VALUES (:albumtype, :albumName, :imageInput, :albumPath, :userId,:genre_id)';
        
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':albumtype' => $albuminfo->albumtype,
                ':albumName'=> $albuminfo->albumName, 
                ':imageInput'=> $albuminfo->imageInput, 
                ':albumPath'=> $albuminfo->albumPath,
                ':userId'=> $userId,
                ':genre_id'=> $albuminfo->genre_id[0],
                 
            ]);
        $sth->rowCount();
        /*$sth->debugDumpParams();

        exit;*/
        $rv = $dbh->lastInsertId();
        return $rv;
        
    }
    public function getalbumdetails($albumId,$userId){
        $dbh = $this->getDb();

       $sql = 'SELECT album_id,album_type,album_name,album_image,album_image_path,userId,album_status FROM album 
                      WHERE album_id= :albumId and UserId= :userId';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':albumId'=> $albumId,':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }

        public function getPortfoliobyalbumid(int $albumId,int $userId, int $skip, int $take){
        $dbh = $this->getDb();
       
        $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE s.UserId = :userId and  s.albumId = :albumId  
                     ORDER BY s.SongId DESC
                    LIMIT :skip, :take";

        $sth = $dbh->prepare($sql);
         $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':albumId', $albumId, PDO::PARAM_INT);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getPortfolioCountbyalbumid($albumId,int $userId){
        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    WHERE s.UserId = ".$userId." and  s.albumId = ".$albumId."";
                   
        $sth = $dbh->prepare($sql);
       
        $sth->execute();
        $rv = $sth->fetchObject();
        /*print_r($rv);
        exit;*/
        // $count = $sth->rowCount();
        return $rv->total;
        // return $count;
    }
    public function getalbumsonguploadsCountByUser($albumId,$albumtype,$userId){
        $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total
                    FROM  songs s
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE s.UserId = ".$userId." and  s.albumId = ".$albumId." and albm.album_type='".$albumtype."'";
                   
        $sth = $dbh->prepare($sql);
       
        $sth->execute();
        $rv = $sth->fetchObject();
        
        return $rv->total;
       
    }

        public function getAlbumwiseSongApprove(int $albumid,int $skip, int $take){
        $dbh = $this->getDb();
        $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name 
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    LEFT JOIN  album albm on albm.album_id =  s.albumId 
                    WHERE s.Status='QA' and s.albumId=".$albumid." order by s.SongId DESC
                    LIMIT :skip, :take";
                    
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getAlbumwiseSongApproveCount($albumid){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM songs s 
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    where s.Status='QA' and s.albumId=".$albumid;
        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
        //$sth->execute();
        // $rv = $sth->fetchObject();
        //$count = $sth->rowCount();
        //return $rv->total;
        // return $count;
       
    }

        public function getalbumsongs(int $albumid, int $skip, int $take){
        $dbh = $this->getDb();
        
        $sql ="SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s 
             JOIN genresofficial Go ON Go.Id = s.Genre 
             INNER JOIN users u ON  s.UserId = u.UserId
             LEFT JOIN  album albm on albm.album_id =  s.albumId 
             WHERE s.Status = 'A' and s.albumId=".$albumid."  ORDER BY s.SongId DESC
             LIMIT :skip, :take";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }

    public function getalbumsongsCount($albumid){
        $dbh = $this->getDb();
       $sql = "SELECT COUNT(*) total
                    FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    INNER JOIN users u ON  s.UserId = u.UserId
                    WHERE s.Status = 'A' and s.albumId=".$albumid."";
                    
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
        //$count = $sth->rowCount();
        //return $count;
       
        
    }
    public function getalbumSongsToReview($albumid,$userId,int $skip, int $take){
        $dbh = $this->getDb();
        
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-30 days"));
          $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sd.DistDate ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId 
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and s.albumId=".$albumid." and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."'
                    ORDER BY s.DistDate DESC LIMIT :skip, :take";    
                         
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getalbumSongsToReviewCount($albumid,$userId){
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-30 days"));
         $dbh = $this->getDb();
         $sql = "SELECT COUNT(*) total FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    WHERE sf.OverallRating = 0 and s.albumId=".$albumid." and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."'
                     ORDER BY s.DistDate DESC";
               
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
        
    }

        public function getAlbumLibrary($albumid,int $userId, int $skip, int $take){
        $dbh = $this->getDb();
        $sql = "SELECT  s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename , sf.OverallRating, s.Facebook_link, s.Twitter_link, s.Spotify_link, s.iTunes_link,
                        s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId
                    FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE djc.DJUserId = :userId and s.albumId=".$albumid."  order by djc.Id DESC
                    LIMIT :skip, :take";
                    
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->bindValue(':skip', $skip, PDO::PARAM_INT);
        $sth->bindValue(':take', $take, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getAlbumLibraryCount($albumid,int $userId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total  FROM djcrate djc
                    JOIN  songs s ON djc.SongId = s.SongId
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                    LEFT JOIN song_feedback sf ON djc.DJUserId = sf.DJUserId AND s.SongId = sf.SongId
                    WHERE djc.DJUserId = :userId and s.albumId=".$albumid." ";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
        //$count = $sth->rowCount();
        //return $rv->total;
        //return $count;
       
    }

    public function getsongalbumdetails($albumId){
        $dbh = $this->getDb();

       $sql = 'SELECT album_image,album_image_path FROM album 
                      WHERE album_id= :albumId ';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':albumId'=> $albumId]);
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getSiteconfiginfo(){
        $dbh = $this->getDb();
        $sql ="SELECT id, ep_limit, album_limit, ideltime, defaultpackage, defaultreviewlimit, fileuploadsize, listeningroomconfig, paypal_env, paypal_key FROM siteconfig WHERE id=1";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    
    public function updateSiteconfiginfo($Siteconfig){
        $sql1="UPDATE global_setting SET set_distibution= :set_distibution WHERE 1";
        $dbh1 = $this->getDb();
        $sth1 = $dbh1->prepare($sql1);
        $sth1->execute(
            [   ':set_distibution' => $Siteconfig->set_distibution,
            ]);
        $rv1 = $sth1->rowCount();

        $sql = 'UPDATE siteconfig
                    SET ep_limit = :ep_limit, album_limit = :album_limit, ideltime = :ideltime, 
                    defaultpackage = :defaultpackage, defaultreviewlimit = :defaultreviewlimit,
                    fileuploadsize = :fileuploadsize, listeningroomconfig = :listeningroomconfig,
                    paypal_env = :paypal_env, paypal_key = :paypal_key
                    WHERE id = 1';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':ep_limit' => $Siteconfig->ep_limit,
                ':album_limit'=> $Siteconfig->album_limit, 
                ':ideltime'=> $Siteconfig->ideltime, 
                ':defaultpackage'=> $Siteconfig->defaultpackage,
                ':defaultreviewlimit'=> $Siteconfig->defaultreviewlimit,
                ':fileuploadsize'=> $Siteconfig->fileuploadsize,
                ':listeningroomconfig'=> $Siteconfig->listeningroomconfig,
                ':paypal_env'=> $Siteconfig->paypal_env,
                ':paypal_key'=> $Siteconfig->paypal_key,
                ]);
        $rv = $sth->rowCount();
        /*$sth->debugDumpParams();
        exit;*/
        return $rv;
    }

    public function getSearchapplications($search){
        $dbh = $this->getDb();
        $sql = "SELECT a.*, u.Username FROM application a 
                    LEFT JOIN users u ON a.UserId = u.UserId
                    where u.UserId = '%$search%' or u.Username like '%".$search."%' or a.Email like '%".$search."%' or a.FirstName like '%".$search."%' or a.LastName like '%".$search."%' ORDER BY a.AppDate DESC";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }  
    public function getadminrights($userId){
        $dbh = $this->getDb();
        $sql = "SELECT userId, application, music, sitesetting, users, auditlog, logs,mediadistribution 
        FROM users_rights WHERE userId= $userId ";
        
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();

        return $rv;
    }
    public function getadminrightsbyid($userId){

         $sql = "SELECT * FROM users_rights WHERE userId = ".$userId;
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
       
        return $rv;
    }
 public function insertadminrights($editadminrights){
        if($editadminrights->applications == ""){
            $editadminrights->applications=0;
        }
        if($editadminrights->music == ""){
            $editadminrights->music=0;
        }
        if($editadminrights->siteconfig == ""){
            $editadminrights->siteconfig=0;
        }
        if($editadminrights->users == ""){
            $editadminrights->users=0;
        }
        if($editadminrights->auditlogs == ""){
            $editadminrights->auditlogs=0;
        }
        if($editadminrights->logs == ""){
            $editadminrights->logs=0;
        }
        if($editadminrights->mediadistribution == ""){
            $editadminrights->mediadistribution=0;
        }


        $sql = "INSERT INTO users_rights(userId, application, music, sitesetting, users, auditlog, logs,mediadistribution) 
        VALUES ('$editadminrights->userId','$editadminrights->applications','$editadminrights->music','$editadminrights->siteconfig','$editadminrights->users','$editadminrights->auditlogs','$editadminrights->logs','$editadminrights->mediadistribution')";
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
        $rv = $dbh->lastInsertId();
       
        /*$sth->debugDumpParams();
        exit;*/
        return $rv;
    }
    public function updateadminrights($editadminrights){
        if($editadminrights->applications == ""){
            $editadminrights->applications=0;
        }
        if($editadminrights->music == ""){
            $editadminrights->music=0;
        }
        if($editadminrights->siteconfig == ""){
            $editadminrights->siteconfig=0;
        }
        if($editadminrights->users == ""){
            $editadminrights->users=0;
        }
        if($editadminrights->auditlogs == ""){
            $editadminrights->auditlogs=0;
        }
        if($editadminrights->logs == ""){
            $editadminrights->logs=0;
        }
        if($editadminrights->mediadistribution == ""){
            $editadminrights->mediadistribution=0;
        }

        $sql = 'UPDATE users_rights
                    SET application = :application, 
                        music = :music, 
                        sitesetting = :sitesetting,
                        users = :users, 
                        auditlog = :auditlog, 
                        logs = :logs,
                        mediadistribution = :mediadistribution
                     WHERE userId = :userId';
        $dbh = $this->getDb();
        $sth = $dbh->prepare($sql);
        $sth->execute(
            [
                ':userId' => $editadminrights->userId,
                ':application'=> $editadminrights->applications, 
                ':music'=> $editadminrights->music, 
                ':sitesetting'=> $editadminrights->siteconfig, 
                ':users'=> $editadminrights->users, 
                ':auditlog'=> $editadminrights->auditlogs, 
                ':logs'=> $editadminrights->logs, 
                ':mediadistribution'=> $editadminrights->mediadistribution,
                ]);
        $rv = $sth->rowCount();
        /*$sth->debugDumpParams();
        exit;*/
        return $rv;
    }
    public function exportdatatopdf($userId,$songId){
       $dbh = $this->getDb();
        $sql = "SELECT u.UserId, u.Username, sf.OverallRating, sf.Comment, 
                c.country_name as Country, st.State as StateOrProvince ,a.City
                FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                join users u on sf.DJUserId=u.UserId 
                join application a on u.UserId = a.UserId 
                join  country c on a.Country = c.country_code
                join states st on a.StateOrProvince= st.State_Abbr
                WHERE sf.OverallRating > 0 and sf.SongId = '".$songId."' and s.UserId='".$userId."'";
              
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    
    public function deleteUserpackage(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM user_pkgs WHERE UserId = :userId');
        $sth->execute([':userId'=> $userId]);
    }
    public function getupdateregisterApplication(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("UPDATE user_pkgs SET CCStatus = '1' where  UserId = :userId and status = 'P'");
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->rowCount();
        return $rv;
    }  
    public function getalbumDelete(int $album_id,int $userId){
        $dbh = $this->getDb();
        $del_album = $dbh->prepare("DELETE FROM album WHERE album_id = '".$album_id."' and userId = '".$userId."'");
        $del_album->execute();
        
        return true;
    }
    public function updateUserpackage($packageId,$userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("UPDATE user_pkgs SET status = 'F' where  UserId = :userId");
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->rowCount();

       $end = date('Y-m-d', strtotime('+1 years'));
       //$packagedetail= $this->getPackage($packageId);
        $sql = "SELECT ap.* FROM account_packages ap  WHERE ap.PkgId = '".$packageId."'";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $packagedetail = $sth->fetchObject();
        if($packagedetail->Price > 0 ){
            $CCStatus = '0';
        }else{
            $CCStatus = '1';
        }
        $sql = "INSERT INTO user_pkgs(UserId,PkgId, CCStatus,ExpDate,status) VALUES(:userId, :pkgId, :CCStatus,:ExpDate,'A')";
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId, ':pkgId' => $packageId,':CCStatus' =>$CCStatus, ':ExpDate' => $end ]);
        
        return true;
    }
    public function getdeleteCrateFriend($crateId,$userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM `songcrate` 
            WHERE  (from_userid = :userId or to_userid = :userId) and 
                   (from_userid = :crateId or to_userid = :crateId)');

        $sth->execute([':crateId'=> $crateId,
                        ':userId'=> $userId]);
        return true;
    }
    public function getuserinfo($userId){
        $dbh = $this->getDb();

       $sql = 'SELECT app.UserId, 
                      u.Username, 
                      app.FirstName, 
                      app.LastName, 
                      c.country_name, 
                      app.City, 
                      app.Gender, 
                      app.Email, 
                      app.DOB,
                      app.MusicServed FROM `application` app 
                      join users u on app.UserId = u.UserId 
                      JOIN country c on app.Country=c.country_code 
                      WHERE app.UserId= :userId';
                    
        $sth = $dbh->prepare($sql);
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->fetchObject();
        return $rv;
    }


   public function getsongdetails(int $songId){
        $dbh = $this->getDb();
        /*$sql = "SELECT SongId, UserId, SongFile, SongPath, SongTitle, ArtistName, Duration, Genre, SubGenre, Label, State, Country, Website, CD, Vinyl, MIDownload, Status, tire2status, Region, Dist_Type, DJAssociation, Normal_Dist, DistDate, artist_image, AlbumName, Copyright_Owner, Year(Copy_Year) as Copy_Year, wheretobuy, sub_distype, fans, SampleFile, Filename,Facebook_link,Twitter_link,Spotify_link,iTunes_link FROM Songs WHERE SongId = :songId";*/
        $sql="SELECT s.SongId, s.UserId, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, g.Name as Genre, s.SubGenre, s.Label, s.State, c.country_name as Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image, a.album_name as AlbumName, s.Copyright_Owner, Year(s.Copy_Year) as Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, s.Filename,s.Facebook_link,s.Twitter_link,s.Spotify_link,s.iTunes_link 
        FROM songs s join genresofficial g on g.Id = s.Genre 
        join country c on c.country_code = s.Country
        left join album a on a.album_id = s.albumId 
        WHERE SongId = :songId";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':songId', $songId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function adminsongreviewedcount($songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                WHERE sf.OverallRating > 0 and sf.SongId = ".$songId."";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function adminsongaveragecountcount($songId){
        $dbh = $this->getDb();
        $sql = "SELECT avg(OverallRating) as total FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                WHERE sf.SongId = ".$songId."";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }

    
   public function adminsonglisteningroomcount($songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM `song_distribution` sf 
                join songs s on sf.SongId=s.SongId 
                WHERE sf.SongId = ".$songId."";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    
    public function adminsongcrateaddedcount($songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM djcrate dj 
                join songs s on dj.SongId=s.SongId 
                WHERE dj.SongId = ".$songId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
        public function adminsongfavouriteaddedcount($songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM djcrate dj 
                join songs s on dj.SongId=s.SongId 
                WHERE dj.favourite='Yes' and  dj.SongId = ".$songId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }

    public function admingetSongFeedbackinfo($songId){
        $dbh = $this->getDb();
        /*$sql = "SELECT u.UserId, u.Username, sf.OverallRating, sf.Comment, 
                c.country_name as Country, st.State as StateOrProvince ,a.City 
                FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                join users u on sf.DJUserId=u.UserId 
                join application a on u.UserId = a.UserId 
                join  country c on a.Country = c.country_code
                join states st on a.StateOrProvince= st.State_Abbr
                WHERE sf.SongId = '".$songId."'";*/
        $sql = "SELECT u.UserId, u.Username, sf.OverallRating, sf.Comment 
                FROM `song_feedback` sf 
                join songs s on sf.SongId=s.SongId 
                join users u on sf.DJUserId=u.UserId 
                WHERE sf.SongId = '".$songId."'";
              
              
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    
        public function deletesongsbyadmin(int $songId){
        $rs=$this->getsongdetails($songId); 
        $userId =$rs->UserId;  
        $dbh = $this->getDb();
        $update_song_limit = $dbh->prepare("Update  application set songlimit=songlimit-1 where UserId = '".$userId."'");
        $update_song_limit->execute();
        $del_feedback = $dbh->prepare("DELETE from song_feedback where SongId = '".$songId."'");
        $del_feedback->execute();
        $del_distribution = $dbh->prepare("DELETE from song_distribution where SongId = '".$songId."'");
        $del_distribution->execute();
        $del_song = $dbh->prepare("DELETE from songs where SongId = '".$songId."'");
        $del_song->execute();
        $del_crate = $dbh->prepare("DELETE from djcrate  where SongId = '".$songId."'");
        $del_crate->execute();
        $del_message = $dbh->prepare("DELETE from messages   where song_id = '".$songId."'");
        $del_message->execute();

        return "success";
    }

    public function getmusicservedwhenapprove($appId){
        $dbh = $this->getDb();
        $sql = "SELECT g.Id FROM application app, genresofficial g 
                WHERE FIND_IN_SET(g.Name ,REPLACE(app.MusicServed, '|', ',')) and app.AppId = $appId";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    public function getmusicservedSongswhenapprove($geners,$SongsReview){
        $dbh = $this->getDb();
         $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        $sql = "SELECT * FROM `songs` WHERE FIND_IN_SET(Genre ,'$geners') and  SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) < '".$DISTRIBUTION_VALUE."')  LIMIT 0 , $SongsReview";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    public function removesongfromListeninggivennotreview($UserId,$listeningroomconfigdays){
         $currentdate = date("Y-m-d");
         $days="-".$listeningroomconfigdays." days";
         $beforedate=date('Y-m-d',strtotime($days));
         $dbh = $this->getDb();
         $sql="SELECT *  FROM song_feedback 
               WHERE `DJUserId` = $UserId and OverallRating = 0  and song_feedback.Comment = '' 
               and  date(FeedbackGivenDate) < '$beforedate'  
               ORDER BY `song_feedback`.`Id` ASC";

          $sth = $dbh->prepare($sql);
          $sth->execute();
          $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
          foreach ($rv as $rvvalue) 
          {
                //echo $rvvalue['Id']."==".$rvvalue['DJUserId']."==".$rvvalue['SongId'];
                /* DELETE FROM song_distribution */

                $sth = $dbh->prepare("DELETE FROM song_distribution 
                    WHERE DJUserId = '".$rvvalue['DJUserId']."' and SongId = '".$rvvalue['SongId']."'");
                $sth->execute([':userId'=> $userId]);

                /* DELETE FROM song_feedback */
                $sth = $dbh->prepare("DELETE FROM song_feedback 
                    WHERE SongId = '".$rvvalue['SongId']."' and DJUserId = '".$rvvalue['DJUserId']."'");
                $sth->execute();
               
          }
    }
    public function getsongdestributioncount($userId,$songId){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM song_distribution sd 
                join songs s on sd.SongId=s.SongId 
                WHERE sd.SongId = ".$songId." and s.UserId=".$userId."";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
 

 public function getsongdestributioncount_tier($songId,$tier){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total FROM song_distribution sd 
                WHERE sd.SongId = ".$songId." and tier = '".$tier."'";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv->total;
       
    }
    public function getsongfeedbackcount_tier($songId,$tier){
        $dbh = $this->getDb();
        $sql = "SELECT COUNT(*) total,avg(overallRating) avgrating FROM song_distribution sd 
                join song_feedback sf on sf.DJUserId = sd.DJUserId and sf.SongId = sd.SongId
                WHERE overallRating > 0 and sd.SongId = ".$songId." and tier = '".$tier."'";

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
       
    }

    public function getmusicservedSongs_tier1(){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        
        $sql = "SELECT *,genresofficial.Name as Genre_name FROM `songs`
                join genresofficial on songs.Genre=genresofficial.Id 
                WHERE SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) < '".$DISTRIBUTION_VALUE."')";
            
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }
    

    public function getTotalNumberOfUser_tier1($Genre,$songid){
        $dbh = $this->getDb();
        
         $str_tier="";    
        $sql="SELECT count(application.UserId) as Total_user
            FROM application 
            join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId

            where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = $songid)  and t.total_dist < application.SongsReview AND  
            application.MusicServed LIKE '%".$Genre."%'" ;

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();          

        $tier1_limit=round($rv->Total_user/4);
        
        $sql1="SELECT application.UserId as tUserId,application.Email ,application.SongsReview, (application.SongsReview-t.total_dist) as t_diff 
                FROM application 
                join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId
                where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = :songId)  and t.total_dist < application.SongsReview AND  
                    application.MusicServed LIKE '%".$Genre."%' limit 0, $tier1_limit" ;                        
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':songId'=> $songid, 
                ]);
        $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);     
        foreach ($rv1 as $value) {
        if($value['tUserId']!=""){
       

        $sql2 = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate,DistType,tier) VALUES (:userId, :songId, now(), now(),'Email','tier1')";    
        
       $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]);
        

         $sql1 = "UPDATE songs s
                    JOIN song_distribution sd ON sd.SongId = :songId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]);
        $rv1 = $sth1->rowCount();
        
       
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
       
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ':overallRating'=> 0, 
                ]);
        

        $str_tier.= "Song id : ".$songid." Distributed to User id : ".$value['tUserId']."<br>";
       


        
        

        }

            
       
    }

    return $str_tier;
}




public function getmusicservedSongs_tier2(){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        
        $sql = "SELECT *,genresofficial.Name as Genre_name FROM `songs`
                join genresofficial on songs.Genre=genresofficial.Id 
                WHERE SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) < '".$DISTRIBUTION_VALUE."')";
            
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }

public function getTotalNumberOfUser_tier2($Genre,$songid){
       
        $dbh = $this->getDb();
        $str_tier=""; 

        $sql="SELECT count(application.UserId) as Total_user
            FROM application 
            join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId

            where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = $songid)  and t.total_dist < application.SongsReview AND  
            application.MusicServed LIKE '%".$Genre."%'" ;

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();          

        $tier1_limit=round($rv->Total_user/2);
        
        $sql1="SELECT application.UserId as tUserId,application.Email ,application.SongsReview, (application.SongsReview-t.total_dist) as t_diff 
                FROM application 
                join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId
                where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = :songId)  and t.total_dist < application.SongsReview AND  
                    application.MusicServed LIKE '%".$Genre."%' limit 0, $tier1_limit" ;                        
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':songId'=> $songid, 
                ]);
        $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);     
        foreach ($rv1 as $value) {
        if($value['tUserId']!=""){
       

        $sql2 = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate,DistType,tier) VALUES (:userId, :songId, now(), now(),'Email','tier2')";
     
      $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]);
        

         $sql1 = "UPDATE songs s
                    JOIN song_distribution sd ON sd.SongId = :songId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]); 
     
        
       
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
       
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ':overallRating'=> 0, 
                ]); 
        

         $str_tier.= "Song id : ".$songid." Distributed to User id : ".$value['tUserId']."<br>";
       

        //return $rv2;
        

        }

            
       
    } 


    return $str_tier;
}


public function getmusicservedSongs_tier3(){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        
        $sql = "SELECT *,genresofficial.Name as Genre_name FROM `songs`
                join genresofficial on songs.Genre=genresofficial.Id 
                WHERE SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) < '".$DISTRIBUTION_VALUE."')";
            
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }

public function getTotalNumberOfUser_tier3($Genre,$songid){
       
        $dbh = $this->getDb();
        
        $str_tier="";


        $sql="SELECT count(application.UserId) as Total_user
            FROM application 
            join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId

            where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = $songid)  and t.total_dist < application.SongsReview AND  
            application.MusicServed LIKE '%".$Genre."%'" ;

        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();          

        $tier1_limit=round($rv->Total_user/3);
        
        $sql1="SELECT application.UserId as tUserId,application.Email ,application.SongsReview, (application.SongsReview-t.total_dist) as t_diff 
                FROM application 
                join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId
                where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = :songId)  and t.total_dist < application.SongsReview AND  
                    application.MusicServed LIKE '%".$Genre."%' limit 0, $tier1_limit" ;                        
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':songId'=> $songid, 
                ]);
        $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);     
        foreach ($rv1 as $value) {
        if($value['tUserId']!=""){
       

        $sql2 = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate,DistType,tier) VALUES (:userId, :songId, now(), now(),'Email','tier3')";
     
      $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]);
        

         $sql1 = "UPDATE songs s
                    JOIN song_distribution sd ON sd.SongId = :songId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]); 
     
        
       
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
       
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ':overallRating'=> 0, 
                ]); 
        

         $str_tier.= "Song id : ".$songid." Distributed to User id : ".$value['tUserId']."<br>";
       


        //return $rv2;
        

        }

            
       
    } 

    return $str_tier;
}




public function getmusicservedSongs_tier4(){
        $dbh = $this->getDb();
        $global_setting=$this->getGlobalSetting();
        $DISTRIBUTION_VALUE=$global_setting->set_distibution;
        
        $sql = "SELECT *,genresofficial.Name as Genre_name FROM `songs`
                join genresofficial on songs.Genre=genresofficial.Id 
                WHERE SongId IN (SELECT sds.SongId FROM `song_distribution` as sds GROUP BY sds.`SongId` HAVING COUNT(Id) < '".$DISTRIBUTION_VALUE."')";
            
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
       
    }

public function getTotalNumberOfUser_tier4($Genre,$songid){
       
        $dbh = $this->getDb();
        

       
       $str_tier="";
        
        $sql1="SELECT application.UserId as tUserId,application.Email ,application.SongsReview, (application.SongsReview-t.total_dist) as t_diff 
                FROM application 
                join (SELECT count(a.Id) as total_dist,a.DJUserId FROM `song_distribution` a join song_feedback b on a.DJUserId = b.DJUserId and a.SongId=b.SongId and b.OverallRating = 0 group by a.`DJUserId`) as t on t.DJUserId = application.UserId
                where Approval_STATUS = 'A' and application.UserId not in (select DJUserId from song_distribution where SongId = :songId)  and t.total_dist < application.SongsReview AND  
                    application.MusicServed LIKE '%".$Genre."%'" ;                        
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':songId'=> $songid, 
                ]);
        $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);     
        foreach ($rv1 as $value) {
        if($value['tUserId']!=""){
       

        $sql2 = "INSERT INTO song_distribution (DJUserId, SongId, DistDate, FeedbackDate,DistType,tier) VALUES (:userId, :songId, now(), now(),'Email','tier4')";
     
      $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]);
        

         $sql1 = "UPDATE songs s
                    JOIN song_distribution sd ON sd.SongId = :songId AND sd.DJUserId = :userId
                    SET s.DistDate = sd.DistDate
                    WHERE sd.DistDate > s.DistDate";
        $sth1 = $dbh->prepare($sql1);
        $sth1->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ]); 
     
        
       
             $sql2 = "INSERT INTO song_feedback (SongId, DJUserId, FeedbackGivenDate, OverallRating, Comment)
                        VALUES (:songId, :userId, now(), :overallRating, '')";
       
       
        $sth2 = $dbh->prepare($sql2);
        $sth2->execute([
                ':userId' => $value['tUserId'],
                ':songId'=> $songid, 
                ':overallRating'=> 0, 
                ]); 
        

        $str_tier.= "Song id : ".$songid." Distributed to User id : ".$value['tUserId']."<br>";
       


        //return $rv2;
        

        }

            
       
    }

    return $str_tier; 
}

public function getfinishsongswithalbumid(int $album_id,int $userId){
        $dbh = $this->getDb();
        $update_song = $dbh->prepare("UPDATE `songs` SET `Status`='QA' WHERE albumId = '".$album_id."' and UserId = '".$userId."'");
        $update_song->execute();
        $update_album = $dbh->prepare("UPDATE `album` SET `album_status`='Finish' WHERE album_id = '".$album_id."' and userId = '".$userId."'");
        $update_album->execute();
        
        return true;
    }

// ------------------------------------------------------------------------------------



public function getSongsToReviewgener($userId){
        $dbh = $this->getDb();
         
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-90 days"));
        $sql = "SELECT  DISTINCT(s.Genre) ,Go.Name GenreName FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."' ORDER BY s.DistDate DESC ";  
                   
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $songtoreview=array();
        $i=0;
        foreach ($rv as $rvvalue) {

           $currentdate = date("Y-m-d");
           $beforedate=date('Y-m-d',strtotime("-90 days"));

           $sqlcount = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sd.DistDate ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."' AND s.Genre=".$rvvalue['Genre']."
                   group by new_albumId ORDER BY s.DistDate DESC";    
                         
                    $sthcount = $dbh->prepare($sqlcount);
                    $sthcount->bindValue(':userId', $userId, PDO::PARAM_INT);
                    $sthcount->execute();

           $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sd.DistDate ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."' AND s.Genre=".$rvvalue['Genre']."
                   group by new_albumId ORDER BY s.DistDate DESC ";    
                         
                    $sth = $dbh->prepare($sql);
                    $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
                    $sth->execute();
                    
                    $songtoreview[$i]['GenerId']=$rvvalue['Genre'];
                    $songtoreview[$i]['GenreName']=$rvvalue['GenreName'];
                    $songtoreview[$i]['data']= $sth->fetchAll(PDO::FETCH_ASSOC);
                    $songtoreview[$i]['DataCount']=$sthcount->rowCount();
                    $songtoreview[$i]['EndLimit']=4;
                    $i++;
                    
        }
        return $songtoreview;
    }
    public function getSongsToReviewbygener($userId,$Genre){
        $dbh = $this->getDb();
         
         $currentdate = date("Y-m-d");
         $beforedate=date('Y-m-d',strtotime("-30 days"));
         $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre,
                       s.SubGenre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename ,sd.DistDate ,s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId FROM songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre 
                     INNER JOIN users u ON  s.UserId = u.UserId
                    JOIN song_distribution sd ON s.SongId = sd.SongId AND sd.DJUserId = :userId
                    LEFT JOIN song_feedback sf ON s.SongId = sf.SongId AND sf.DJUserId = :userId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                    WHERE sf.OverallRating = 0 and date(s.DistDate) BETWEEN '".$beforedate."' AND '".$currentdate."' AND s.Genre=".$Genre."
                   group by new_albumId ORDER BY s.DistDate DESC";    
                         
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
 public function deletesongsbyalbum(int $userId,int $albumId){
        $dbh = $this->getDb();
        //echo $sql="UPDATE Songs SET Status= 'D' where UserId = '".$userId."' and albumId = '".$albumId."'"; 
        $update_song = $dbh->prepare("UPDATE songs SET Status= 'D' where UserId = '".$userId."' and albumId = '".$albumId."'");
        $update_song->execute();
        

        return "success";
    }
     public function getpaypalUserpayment($userId,$packageId,$paymentid){
        //echo $userId."--".$packageId."--".$paymentid;
        //exit;
        $dbh = $this->getDb();
        $sql = "INSERT INTO paypal_tra(user_id, custom_id, tra_id, status) VALUES ('".$userId."','".$packageId."','".$paymentid."','Y')";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $dbh->lastInsertId;
        $rv = $sth->rowCount();
        return $rv;
        //return true;
        
    }
    public function songinuserlisteningroom(int $songId, int $userId){
        $dbh = $this->getDb();
         $sql = "SELECT *
                    FROM song_feedback 
                    WHERE DJUserId = $userId AND SongId = $songId";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->rowCount();
        return $rv;
    }

    public function songAvgrating(int $songId){
        $dbh = $this->getDb();
         $sql = "SELECT AVG(OverallRating) as avgrating FROM `song_feedback` WHERE OverallRating > 0 and `SongId` = $songId";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return number_format((float)$rv->avgrating, 2, '.', '');
    }
    public function checkincrate($UserId,$songid){
        $dbh = $this->getDb();
         $sql = "SELECT * FROM `djcrate` WHERE `SongId` = $songid and DJUserId =$UserId";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
        public function getGenreGroupNames(){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM `genresofficial` WHERE `parent_id` = 0 ORDER BY `Id` ASC";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

            
            
            $sql1 = "SELECT * FROM `genresofficial` WHERE `parent_id` = ".$rvvalue['Id']." ORDER BY `Id` ASC";
            $sth1 = $dbh->prepare($sql1);
            $sth1->execute();
            $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);

            if($sth1->rowCount() > 0){
                $genresofficial[$i]['id']=$rvvalue['Name'];
                $genresofficial[$i]['name']=$rvvalue['Name'];
                $genresofficial[$i]['isLabel']=true;
           
            foreach ($rv1 as $rvvalue1) {
                $i++;

            $genresofficial[$i]['id']=$rvvalue1['Name'];
            $genresofficial[$i]['name']=$rvvalue1['Name'];
            $genresofficial[$i]['parentId']=$rvvalue['Id'];
            

            }
             $i++;
             }


           


        }

    /*{ id: 8, name: 'White', parentId: 5 }*/
        return $genresofficial;
    }
    public function getPortfolionew(int $userId){
        $dbh = $this->getDb();
        $countpro = $this->getpromember($userId);
        if($countpro == 1){
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId  and `albumId` IS NULL group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }else{
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name , IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId and `albumId` IS NULL and (s.Status = 'A' or s.Status = 'QA'  or s.Status = 'Inprocess' ) group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getPortfolioEp(int $userId){
        $dbh = $this->getDb();
        $countpro = $this->getpromember($userId);
        if($countpro == 1){
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name ,albm.genre as album_gener, IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId   and albm.album_type = 'EP' group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }else{
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name ,albm.genre as album_gener, IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId  and albm.album_type = 'EP' and (s.Status = 'A' or s.Status = 'QA'  or s.Status = 'Inprocess' ) group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
    public function getPortfolioAlbum(int $userId){
        $dbh = $this->getDb();
        $countpro = $this->getpromember($userId);
        if($countpro == 1){
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name ,albm.genre as album_gener, IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId  and albm.album_type = 'Album' group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }else{
             $sql = "SELECT  s.SongId, s.UserId, u.Username, s.SongFile, s.SongPath, s.SongTitle, s.ArtistName, s.Duration, Go.Name Genre, s.Label, s.State, s.Country, s.Website, s.CD, s.Vinyl, s.MIDownload, s.Status, 
                       s.tire2status, s.Region, s.Dist_Type, s.DJAssociation, s.Normal_Dist, s.DistDate, s.artist_image,
                        s.AlbumName, s.Copyright_Owner, s.Copy_Year, s.wheretobuy, s.sub_distype, s.fans, s.SampleFile, 
                        s.Filename, s.albumId , albm.album_type , albm.album_name ,albm.genre as album_gener, IFNULL(s.albumId,RAND()) as new_albumId 
                    FROM  songs s
                    JOIN genresofficial Go ON Go.Id = s.Genre
                    INNER JOIN users u ON  s.UserId = u.UserId
                    LEFT JOIN  album albm on albm.album_id =  s.albumId
                     WHERE s.UserId = :userId and albm.album_type = 'Album' and (s.Status = 'A' or s.Status = 'QA'  or s.Status = 'Inprocess' ) group by new_albumId  ORDER BY s.SongId DESC
                    ";
        }
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
        public function getGenreGroupNamesedit(){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM `genresofficial` WHERE `parent_id` = 0 ORDER BY `Id` ASC";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

            
            
            $sql1 = "SELECT * FROM `genresofficial` WHERE `parent_id` = ".$rvvalue['Id']." ORDER BY `Id` ASC";
            $sth1 = $dbh->prepare($sql1);
            $sth1->execute();
            $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);

            if($sth1->rowCount() > 0){
                $genresofficial[$i]['id']=$rvvalue['Id'];
                $genresofficial[$i]['name']=$rvvalue['Name'];
                $genresofficial[$i]['isLabel']=true;
           
            foreach ($rv1 as $rvvalue1) {
                $i++;

            $genresofficial[$i]['id']=$rvvalue1['Id'];
            $genresofficial[$i]['name']=$rvvalue1['Name'];
            $genresofficial[$i]['parentId']=$rvvalue['Id'];
            

            }
             $i++;
             }


           


        }

    /*{ id: 8, name: 'White', parentId: 5 }*/
        return $genresofficial;
    }
     public function getdeleteSongcraterequest($crate_id){
        $dbh = $this->getDb();
        $sth = $dbh->prepare('DELETE FROM `songcrate` WHERE `crate_id` = :crate_id');
        $sth->execute([':crate_id'=> $crate_id]);
        return true;
    }
     public function getUswersGenreGroupNames($userId){
        $dbh = $this->getDb();
        $usersql="SELECT `MusicServed` FROM `application` WHERE `UserId` = $userId";
        $sthuser = $dbh->prepare($usersql);
        $sthuser->execute();
        $rvuser = $sthuser->fetchObject();
        $usermusicserved=$rvuser->MusicServed;
        $usermusicserved1 = explode("|", $usermusicserved);
         $usermusicserved = implode("','", $usermusicserved1);
        



      $sql = "SELECT * FROM `genresofficial` WHERE  `Name` IN ('".$usermusicserved."')  group by `parent_id` ORDER BY `parent_id` ASC";
       
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

            
            
            $sql1 = "SELECT * FROM `genresofficial` WHERE `parent_id` = ".$rvvalue['parent_id']." and  `Name` IN ('".$usermusicserved."')  ORDER BY `Id` ASC";
            $sth1 = $dbh->prepare($sql1);
            $sth1->execute();
            $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);

            if($sth1->rowCount() > 0){
                 $parentsql="SELECT * FROM `genresofficial` WHERE `Id` = ".$rvvalue['parent_id']."";
                $parentsthuser = $dbh->prepare($parentsql);
                $parentsthuser->execute();
                $parentuser = $parentsthuser->fetchObject();

                $genresofficial[$i]['id']=$parentuser->Id;
                $genresofficial[$i]['name']=$parentuser->Name;
                $genresofficial[$i]['isLabel']=true;
           
                    foreach ($rv1 as $rvvalue1) {
                        if(in_array($rvvalue1['Name'], $usermusicserved1))
                        {
                        $i++;

                    $genresofficial[$i]['id']=$rvvalue1['Id'];
                    $genresofficial[$i]['name']=$rvvalue1['Name'];
                    $genresofficial[$i]['isLabel']=false;
                    $genresofficial[$i]['parentId']=$rvvalue['Id'];
                    
                }
                    }
             $i++;
             }


           


        }

    /*{ id: 8, name: 'White', parentId: 5 }*/
        return $genresofficial;
    }
        public function getGenreGroupNamesbrowse(){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM `genresofficial` WHERE `parent_id` = 0 ORDER BY `Id` ASC";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

            
            
            $sql1 = "SELECT * FROM `genresofficial` WHERE `parent_id` = ".$rvvalue['Id']." ORDER BY `Id` ASC";
            $sth1 = $dbh->prepare($sql1);
            $sth1->execute();
            $rv1 = $sth1->fetchAll(PDO::FETCH_ASSOC);

            if($sth1->rowCount() > 0){
                $genresofficial[$i]['id']=$rvvalue['Id'];
                $genresofficial[$i]['name']=$rvvalue['Name'];
                $genresofficial[$i]['isLabel']=true;
           
            /*foreach ($rv1 as $rvvalue1) {
                $i++;

            $genresofficial[$i]['id']=$rvvalue1['Name'];
            $genresofficial[$i]['name']=$rvvalue1['Name'];
            $genresofficial[$i]['parentId']=$rvvalue['Id'];
            

            }*/
             $i++;
             }


           


        }

    /*{ id: 8, name: 'White', parentId: 5 }*/
        return $genresofficial;
    }
    public function getSubGenreByid($generid){
        $dbh = $this->getDb();
        $sql = "SELECT * FROM `genresofficial` WHERE `parent_id` = $generid ORDER BY `Id` ASC";
        $sth = $dbh->prepare($sql);
        $sth->execute();
        //$rv = $sth->fetchObject();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

                $genresofficial[$i]['id']=$rvvalue['Id'];
                $genresofficial[$i]['name']=$rvvalue['Name'];
                $genresofficial[$i]['isLabel']=true;
                $i++;
        }
        return $genresofficial;
    }
    public function getnewsongalbumdetail($albumId){
        $dbh = $this->getDb();

        $sql = "SELECT album_id,album_type,album_name,album_image,album_image_path,userId,genre,album_status FROM album 
                      WHERE album_id= $albumId";
                   
        $sth = $dbh->prepare($sql);
        $sth->execute();
        $rv = $sth->fetchObject();
        return $rv;
    }
    public function getmessagedetails(int $userId){
        $dbh = $this->getDb();
       /* $sql = "SELECT t.message_id, t.from_id, t.to_id, t.song_id,  FROM_UNIXTIME(t.send_date) as send_date, t.status, t.subject, t.message_content, t.message_status, t.del_sender, t.lbb_id , u.Username as fromusername , uto.Username as tousername, s.SongTitle FROM `messages` `t` LEFT JOIN users u ON u.UserId = t.from_id LEFT JOIN users uto ON uto.UserId = t.to_id LEFT JOIN songs s ON s.SongId = t.song_id WHERE message_id IN (SELECT s.message_id FROM messages s WHERE s.`from_id` =:userId OR s.`to_id` =:userId GROUP BY (IF(s.`from_id`=:userId, s.`to_id`, s.`from_id`))) GROUP BY song_id ORDER BY message_id DESC";*/
        


        $sql="SELECT t.message_id, t.from_id, t.to_id, t.song_id, FROM_UNIXTIME(t.send_date) as send_date, t.status, t.subject, t.message_content, t.message_status, t.del_sender, t.lbb_id , u.Username as fromusername , uto.Username as tousername, s.SongTitle FROM messages t 
            LEFT JOIN users u ON u.UserId = t.from_id 
            LEFT JOIN users uto ON uto.UserId = t.to_id 
            LEFT JOIN songs s ON s.SongId = t.song_id 
            WHERE message_id IN (select MAX(message_id)
                    from ( SELECT s.message_id,s.to_id,s.from_id,s.song_id FROM messages s 
                            WHERE s.from_id =:userId OR s.to_id =:userId order by message_id desc ) as a 
            GROUP BY song_id ORDER BY message_id DESC )";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
         $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

                
                if($rvvalue['from_id'] == $userId){
                    $genresofficial[$i]['message_id']=$rvvalue['message_id'];
                    $genresofficial[$i]['from_id']=$rvvalue['from_id'];
                    $genresofficial[$i]['to_id']=$rvvalue['to_id'];
                    $genresofficial[$i]['song_id']=$rvvalue['song_id'];
                    $genresofficial[$i]['send_date']=$rvvalue['send_date'];
                    $genresofficial[$i]['status']=$rvvalue['status'];
                    $genresofficial[$i]['subject']=$rvvalue['subject'];
                    $genresofficial[$i]['message_content']=$rvvalue['message_content'];
                    $genresofficial[$i]['message_status']=$rvvalue['message_status'];
                    $genresofficial[$i]['del_sender']=$rvvalue['del_sender'];
                    $genresofficial[$i]['lbb_id']=$rvvalue['lbb_id'];
                    $genresofficial[$i]['fromusername']=$rvvalue['fromusername'];
                    $genresofficial[$i]['tousername']=$rvvalue['tousername'];
                    $genresofficial[$i]['SongTitle']=$rvvalue['SongTitle'];
                    $genresofficial[$i]['messagestatus']='receiver';
                }else{
                    $genresofficial[$i]['message_id']=$rvvalue['message_id'];
                    $genresofficial[$i]['from_id']=$rvvalue['from_id'];
                    $genresofficial[$i]['to_id']=$rvvalue['to_id'];
                    $genresofficial[$i]['song_id']=$rvvalue['song_id'];
                    $genresofficial[$i]['send_date']=$rvvalue['send_date'];
                    $genresofficial[$i]['status']=$rvvalue['status'];
                    $genresofficial[$i]['subject']=$rvvalue['subject'];
                    $genresofficial[$i]['message_content']=$rvvalue['message_content'];
                    $genresofficial[$i]['message_status']=$rvvalue['message_status'];
                    $genresofficial[$i]['del_sender']=$rvvalue['del_sender'];
                    $genresofficial[$i]['lbb_id']=$rvvalue['lbb_id'];
                    $genresofficial[$i]['fromusername']=$rvvalue['fromusername'];
                    $genresofficial[$i]['tousername']=$rvvalue['tousername'];
                    $genresofficial[$i]['SongTitle']=$rvvalue['SongTitle'];
                    $genresofficial[$i]['messagestatus']='sender';
                   
                }
                $i++;
        }
        return $genresofficial;
       // return $rv;
    }
    public function getmessagelistbyid($userId,$songid){
        $dbh = $this->getDb();
         $sql = "SELECT t.message_id, t.from_id, t.to_id, t.song_id,  FROM_UNIXTIME(t.send_date) as send_date, t.status, t.subject, t.message_content, t.message_status, t.del_sender, t.lbb_id , u.Username as fromusername , uto.Username as tousername, s.SongTitle 
            FROM `messages` `t` 
            LEFT JOIN users u ON u.UserId = t.from_id 
            LEFT JOIN users uto ON uto.UserId = t.to_id 
            LEFT JOIN songs s ON s.SongId = t.song_id 
            WHERE song_id= :songid and (from_id = :userId or to_id = :userId) ORDER BY message_id ASC";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId);
        $sth->bindValue(':songid', $songid);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        
        $genresofficial=array();
        $i=0;
        foreach ($rv as $rvvalue) {

               
                $updatesql="UPDATE `messages` SET message_status='R' WHERE to_id=".$userId;
                $updatesth = $dbh->prepare($updatesql);
                $updatesth->execute();
                if($rvvalue['from_id'] == $userId){
                    $genresofficial[$i]['message_id']=$rvvalue['message_id'];
                    $genresofficial[$i]['from_id']=$rvvalue['from_id'];
                    $genresofficial[$i]['to_id']=$rvvalue['to_id'];
                    $genresofficial[$i]['song_id']=$rvvalue['song_id'];
                    $genresofficial[$i]['send_date']=$rvvalue['send_date'];
                    $genresofficial[$i]['status']=$rvvalue['status'];
                    $genresofficial[$i]['subject']=$rvvalue['subject'];
                    $genresofficial[$i]['message_content']=$rvvalue['message_content'];
                    $genresofficial[$i]['message_status']=$rvvalue['message_status'];
                    $genresofficial[$i]['del_sender']=$rvvalue['del_sender'];
                    $genresofficial[$i]['lbb_id']=$rvvalue['lbb_id'];
                    $genresofficial[$i]['fromusername']=$rvvalue['fromusername'];
                    $genresofficial[$i]['tousername']=$rvvalue['tousername'];
                    $genresofficial[$i]['SongTitle']=$rvvalue['SongTitle'];
                    $genresofficial[$i]['messagestatus']='receiver';
                }else{
                    $genresofficial[$i]['message_id']=$rvvalue['message_id'];
                    $genresofficial[$i]['from_id']=$rvvalue['from_id'];
                    $genresofficial[$i]['to_id']=$rvvalue['to_id'];
                    $genresofficial[$i]['song_id']=$rvvalue['song_id'];
                    $genresofficial[$i]['send_date']=$rvvalue['send_date'];
                    $genresofficial[$i]['status']=$rvvalue['status'];
                    $genresofficial[$i]['subject']=$rvvalue['subject'];
                    $genresofficial[$i]['message_content']=$rvvalue['message_content'];
                    $genresofficial[$i]['message_status']=$rvvalue['message_status'];
                    $genresofficial[$i]['del_sender']=$rvvalue['del_sender'];
                    $genresofficial[$i]['lbb_id']=$rvvalue['lbb_id'];
                    $genresofficial[$i]['fromusername']=$rvvalue['fromusername'];
                    $genresofficial[$i]['tousername']=$rvvalue['tousername'];
                    $genresofficial[$i]['SongTitle']=$rvvalue['SongTitle'];
                    $genresofficial[$i]['messagestatus']='sender';
                   
                }
                $i++;
        }
        return $genresofficial;
        //return $rv;
    }
    public function getsongmessagedetails($userId,$songid)
    {
        $dbh = $this->getDb();

        $sql = "SELECT t.message_id, t.from_id, t.to_id, t.song_id,  FROM_UNIXTIME(t.send_date) as send_date, t.status, t.subject, t.message_content, t.message_status, t.del_sender, t.lbb_id , u.Username as fromusername , uto.Username as tousername, s.SongTitle 
            FROM `messages` `t` 
            LEFT JOIN users u ON u.UserId = t.from_id 
            LEFT JOIN users uto ON uto.UserId = t.to_id 
            LEFT JOIN songs s ON s.SongId = t.song_id 
            WHERE song_id= :songid and message_id IN (SELECT s.message_id FROM messages s WHERE s.`from_id` =:userId OR s.`to_id` =:userId GROUP BY (IF(s.`from_id`=:userId, s.`to_id`, s.`from_id`))) GROUP BY song_id ORDER BY message_id DESC";
        $sth = $dbh->prepare($sql);
        $sth->bindValue(':userId', $userId);
        $sth->bindValue(':songid', $songid);
        $sth->execute();
        $rv = $sth->fetchAll(PDO::FETCH_ASSOC);
        $rv=$rv[0];
         $genresofficial=array();
        if($rv['from_id'] == $userId){
            $genresofficial['message_id']=$rv['message_id'];
            $genresofficial['from_id']=$rv['from_id'];
            $genresofficial['to_id']=$rv['to_id'];
            $genresofficial['song_id']=$rv['song_id'];
            $genresofficial['send_date']=$rv['send_date'];
            $genresofficial['status']=$rv['status'];
            $genresofficial['subject']=$rv['subject'];
            $genresofficial['message_content']=$rv['message_content'];
            $genresofficial['message_status']=$rv['message_status'];
            $genresofficial['del_sender']=$rv['del_sender'];
            $genresofficial['lbb_id']=$rv['lbb_id'];
            $genresofficial['fromusername']=$rv['fromusername'];
            $genresofficial['tousername']=$rv['tousername'];
            $genresofficial['SongTitle']=$rv['SongTitle'];
            $genresofficial['messagestatus']='receiver';
        }else{
             $genresofficial['message_id']=$rv['message_id'];
            $genresofficial['from_id']=$rv['from_id'];
            $genresofficial['to_id']=$rv['to_id'];
            $genresofficial['song_id']=$rv['song_id'];
            $genresofficial['send_date']=$rv['send_date'];
            $genresofficial['status']=$rv['status'];
            $genresofficial['subject']=$rv['subject'];
            $genresofficial['message_content']=$rv['message_content'];
            $genresofficial['message_status']=$rv['message_status'];
            $genresofficial['del_sender']=$rv['del_sender'];
            $genresofficial['lbb_id']=$rv['lbb_id'];
            $genresofficial['fromusername']=$rv['fromusername'];
            $genresofficial['tousername']=$rv['tousername'];
            $genresofficial['SongTitle']=$rv['SongTitle'];
            $genresofficial['messagestatus']='sender';
        }
        return $genresofficial;
    }
    public function getadminupdateregisterApplication(int $userId){
        $dbh = $this->getDb();
        $sth = $dbh->prepare("UPDATE user_pkgs SET status = 'A' where  UserId = :userId and status = 'P'");
        $sth->execute([':userId'=> $userId]);
        $rv = $sth->rowCount();
        return $rv;
    }  


 }


