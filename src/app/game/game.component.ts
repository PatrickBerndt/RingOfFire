import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  pickCardAnimation = false; 
  currentCard: string = '';
  game!: Game;
  

  constructor(public dialog: MatDialog){}

  ngOnInit(): void{
    this.newGame();
  }

  newGame(){
    this.game = new Game();
  }


  takeCard(){
    if(!this.pickCardAnimation){
      this.currentCard = this.game.stack.pop()!;
      
    
      this.pickCardAnimation = true;

      if(this.game.currentPlayer < this.game.players.length -1){
        this.game.currentPlayer++;
      }else{
        this.game.currentPlayer= 0;
      }


      setTimeout(() => {
        this.game.playedCards.push(this.currentCard)
        this.pickCardAnimation = false;
      }, 1000);
    }
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
  
    });

    dialogRef.afterClosed().subscribe(name => {
      if(name && name.length > 0){
        this.game.players.push(name);
      }
      
    });
  }


}
