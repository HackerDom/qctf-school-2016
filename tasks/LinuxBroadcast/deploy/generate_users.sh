#!/bin/bash

for i in `seq 1 100`; do 
    team=team$i
    password=`echo -n broadcastlinux_team_${i}_salt | md5sum | awk '{ print $1 }'`
    echo $team:$password
    pass=$(perl -e 'print crypt($ARGV[0], "password")' $password)

    userdel $team
    rm -r /home/$team
    useradd -m -p $pass -g team $team
    chsh -s /bin/bash $team
    chmod -R go-rwx /home/$team
done

chmod -R go-rwx /home/broadcast
