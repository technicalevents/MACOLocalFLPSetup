#!/bin/sh

macodir=${PWD}
echo $macodir

macolocaldir=$macodir/maco_local_runrepo/
macolocalprocesscode=$macolocaldir/webapp/
macolocalmessagecode=$macolocaldir/displaymessage/webapp/
macolocalmtrprocesscode=$macolocaldir/overviewprocess/webapp/
macolocalmtrmessagecode=$macolocaldir/overviewmessage/webapp/
macolocalmarketpartnercode=$macolocaldir/displaymarketpartners/webapp/
macolocalreuselibcode=$macolocaldir/mmt-ui-lib/src/com/sap/cd/maco/mmt/ui/reuse/

displayprocessdir=$macodir/mmt-ui-app-dispprocess-b
displayprocesscode=$displayprocessdir/webapp/

displaymessagedir=$macodir/mmt-ui-app-dispmsg-b
displaymessagecode=$displaymessagedir/webapp/

 monitorprocessdir=$macodir/mmt-ui-app-overviewprocess-b
 monitorprocesscode=$monitorprocessdir/webapp/

# monitormessagedir=$macodir/mmt-ui-app-overviewmessage
# monitormessagecode=$monitormessagedir/overviewmessage/webapp/

displaymarketpartnerdir=$macodir/mmt-ui-app-displaymarketpartners-b
displaymarketpartnercode=$displaymarketpartnerdir/webapp/

reuselibdir=$macodir/mmt-ui-lib-b
reuselibcode=$reuselibdir/src/com/sap/cd/maco/mmt/ui/reuse/

echo $macolocaldir
echo $displayprocessdir
echo $monitormessagecode

cd $macolocaldir
git checkout master
git reset --hard origin/master
git pull origin master

echo "/nStarting Copying displayprocess code"
cd $displayprocessdir
git checkout dev
git reset --hard origin/dev
git pull origin

cp -f -r $macolocalprocesscode $displayprocesscode

git add .

echo "/nStarting Copying displaymessage code"
cd $displaymessagedir
git checkout dev
git reset --hard origin/dev
git pull origin

cp -f -r $macolocalmessagecode $displaymessagecode

git add .

echo "/nStarting Copying overviewprocess code"
cd $monitorprocessdir
git checkout dev
git reset --hard origin/dev
git pull origin

cp -f -r $macolocalmtrprocesscode $monitorprocesscode

 git add .

# echo "/nStarting Copying overviewmessagecode"
# cd $monitormessagedir
# git checkout dev
# git reset --hard origin/dev
# git pull origin

# cp -f -r $macolocalmtrmessagecode $monitormessagecode

# git add .

echo "/nStarting Copying displaymarketpartner code"
cd $displaymarketpartnerdir
# git checkout dev
# git reset --hard origin/dev
# git pull origin

cp -f -r $macolocalmarketpartnercode $displaymarketpartnercode

 git add .

echo "/nStarting Copying reuselib code"
cd $reuselibdir
git checkout dev
git reset --hard origin/dev
git pull origin

cp -f -r $macolocalreuselibcode $reuselibcode

git add .

