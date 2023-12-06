// minimap.js

class minimap {
    constructor() {
        this.index2 = 0;
    }

    update(time) {
    }

    render() {

        // *** Draw the window

        // Draw the white borders
        let topLeftX = screenWidth-mazeW-2;
        let topLeftY = screenHeight-mazeH-2;
        setPen(whiteColor);
        rect(topLeftX-2, topLeftY-2, mazeW+4, mazeH+4);
        
        // Fill with black.
        setPen(blackColor);
        rect(topLeftX, topLeftY, mazeW, mazeH);

        // Draw the active game objects to the minimap.
        for (let ii = 0; ii < numOfGobs; ii++) 
        {
            let o = allObjectArray[ii];
            if(o.isActive)
            {
                // Set the color.
                let o = allObjectArray[ii]; 
                if(o.type=="hero")
                    setPen(whiteColor);
                else if(o.type=="cow")
                    setPen(brownColor);
                else if(o.type=="fox")
                    setPen(yellowColor); 

                // Draw the dot.               
                let mmx = o.x/mazeTileSize;
                let mmy = o.y/mazeTileSize;
                rect(topLeftX+mmx, topLeftY+mmy, 2, 2);
            }
        }        
    }
}

