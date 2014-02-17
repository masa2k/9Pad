#!/bin/bash
# Bash Shell Script for creation of carousel elements.
# Naming scheme for carousel elements: page<INDEX>.png where INDEX starts from 0.
# The script creates a style entry in cards.css for each carousel element found in the resources/images folder.
/**************************** 
 * Carousel elements.
 * This file is generated by the create_pages.sh script in the scripts folder.
 */
echo "/****************************" > client/9Pad/resources/css/cards.css
echo "* Carousel elements." >> client/9Pad/resources/css/cards.css
echo "* This file is generated by the create_pages.sh script in the scripts folder." >> client/9Pad/resources/css/cards.css
echo "*/" >> client/9Pad/resources/css/cards.css

declare -r CONTENT_PATH=../client/9Pad/resources/images

ls $CONTENT_PATH/page*.png | sed "s/.*\///" | while read F
do
  LEN=${#F}
  INDEX=${F:4:LEN-8}
   
  echo ".myContentCard$INDEX {" >> $CONTENT_PATH/cards.css  
  echo "  background: url('../images/page$INDEX.png') no-repeat center;" >> $CONTENT_PATHcards.css
  echo "}" >> $CONTENT_PATH/cards.css  

done

