<?php
class mpeg { 
    function __construct($file = false) { 
        $this->filename = $file; 
        $this->error = false; 
        $this->error_texts[] = array(); 
        $this->print_errors = true; 
    } 

    function adderror($text) { 
        $this->error = true; 
        $this->error_texts[] = $text; 
        if ($this->print_errors) { 
            echo $text."\n"; 
        } 
    } 

    function getinfo($file = false) { 
        if (!$file) { 
            $file = $this->filename; 
        } 
        if (!$file) { 
            $this->adderror('file not set'); 
        } 

        if (! ($f = fopen($file, 'rb')) ) { 
            $this->adderror('Unable to open ' . $file); 
            return false; 
        } 

        $this->filesize = filesize($file); 

        do { 
            while (fread($f,1) != Chr(255)) { // Find the first frame 
            //if ($this->debug) echo "Find...\n"; 
                if (feof($f)) { 
                    $this->adderror('No mpeg frame found'); 
                    return false; 
                } 
            } 
            fseek($f, ftell($f) - 1); // back up one byte 

            $frameoffset = ftell($f); 

            $r = fread($f, 4); 
            // Binary to Hex to a binary sting. ugly but best I can think of. 
            $bits = unpack('H*bits', $r); 
            $bits =  base_convert($bits['bits'],16,2); 
        } while (!$bits[8] and !$bits[9] and !$bits[10]); // 1st 8 bits true from the while 

        $this->frameoffset = $frameoffset; 

        fclose($f); 

        if ($bits[11] == 0) { 
            $this->mpeg_ver = "2.5"; 
            $bitrates = array( 
                '1' => array(0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0), 
                '2' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0), 
                '3' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0), 
                     ); 
        } else if ($bits[12] == 0) { 
            $this->mpeg_ver = "2"; 
            $bitrates = array( 
                '1' => array(0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 0), 
                '2' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0), 
                '3' => array(0,  8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160, 0), 
                     ); 
        } else { 
            $this->mpeg_ver = "1"; 
            $bitrates = array( 
                '1' => array(0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 0), 
                '2' => array(0, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384, 0), 
                '3' => array(0, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 0), 
                     ); 
        } 

        $layer = array( 
            array(0,3), 
            array(2,1), 
                  ); 
        $this->layer = $layer[$bits[13]][$bits[14]]; 

        if ($bits[15] == 0) { 
            // It's backwards, if the bit is not set then it is protected. 
            $this->crc = true; 
        } 

        $bitrate = 0; 
        if ($bits[16] == 1) $bitrate += 8; 
        if ($bits[17] == 1) $bitrate += 4; 
        if ($bits[18] == 1) $bitrate += 2; 
        if ($bits[19] == 1) $bitrate += 1; 
        $this->bitrate = $bitrates[$this->layer][$bitrate]; 

        $frequency = array( 
            '1' => array( 
                '0' => array(44100, 48000), 
                '1' => array(32000, 0), 
                    ), 
            '2' => array( 
                '0' => array(22050, 24000), 
                '1' => array(16000, 0), 
                    ), 
            '2.5' => array( 
                '0' => array(11025, 12000), 
                '1' => array(8000, 0), 
                      ), 
              ); 
        $this->frequency = $frequency[$this->mpeg_ver][$bits[20]][$bits[21]]; 

        $this->padding = $bits[22]; 
        $this->private = $bits[23]; 

        $mode = array( 
            array('Stereo', 'Joint Stereo'), 
            array('Dual Channel', 'Mono'), 
                 ); 
        $this->mode = $mode[$bits[24]][$bits[25]]; 

        // XXX: I dunno what the mode extension is for bits 26,27 

        $this->copyright = $bits[28]; 
        $this->original = $bits[29]; 

        $emphasis = array( 
            array('none', '50/15ms'), 
            array('', 'CCITT j.17'), 
                 ); 
        $this->emphasis = $emphasis[$bits[30]][$bits[31]]; 

        if ($this->bitrate == 0) { 
            $s = -1; 
        } else { 
            $s = ((8*filesize($file))/1000) / $this->bitrate; 
        } 
        $this->length = sprintf('%02d:%02d',floor($s/60),floor($s-(floor($s/60)*60))); 
        $this->lengths = (int)$s; 
    } 
    function return_info($file = false) { 
        if ($file !== false) { getinfo($file); } 

        if (!isset($this->filename)) { echo "oh"; return false; } 
        else { 
            if (!isset($this->bitrate)) { echo "do"; return false; } 
            else { 
                return array( 
                    'mpeg_ver'    => $this->mpeg_ver, 
                    'layer'       => $this->layer, 
                    'bitrate'     => $this->bitrate, 
                    'frequency'   => $this->frequency, 
                    'mode'        => $this->mode, 
                    'copyright'   => $this->copyright, 
                    'original'    => $this->original, 
                    'emphasis'    => $this->emphasis, 
                    'length'      => $this->length, 
                    'lengths'     => $this->lengths); 
            } 
        } 
    } 
}