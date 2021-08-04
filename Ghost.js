import { DIRECTIONS, OBJECT_TYPE } from "./setup";
import { randomMovement } from "./ghostMoves";
export class Ghost{
    constructor(speed = 5, startPos, movement, name){
        this.name = name;
        this.movement =movement;
        this.startPos =startPos;
        this.pos = startPos;
        this.dir = DIRECTIONS.ArrowRight;
        this.speed=speed;
        this.timer = 0;
        this.isScared = false;
        this.rotation = false;
    }

    shouldMove(){
        
        if(this.timer == this.speed){
            this.timer =0;
           // console.log("#* ");
            return true;
        }else{
            this.timer++;
            
        }
        
    }

    getNextMove(objectExists){
        //console.log(this);
        const {nextMovePos, direction } = this.movement(this.pos, this.dir, objectExists);
        //console.log(nextMovePos+"^ ");
        return {nextMovePos, direction};
    }

    makeMove(){
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];
        const classesToRemove = [ OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];

        if(this.isScared){
            classesToAdd=[ ...classesToAdd, OBJECT_TYPE.SCARED];

        }
        return {classesToRemove, classesToAdd};
    }

    setNewPos(nextMovePos, direction){
        this.pos = nextMovePos;
        this.dir =direction;
    }
}