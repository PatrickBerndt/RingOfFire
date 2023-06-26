import { Component ,inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface Item {
  name: string,
  
};

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  firestore: Firestore = inject(Firestore);
  pickCardAnimation = false; 
  currentCard: string = '';
  game!: Game;
  item$: Observable<import("@angular/fire/firestore").DocumentData[]>;
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog){

  }

  

  ngOnInit(): void{
    this.newGame();
    this.route.params.subscribe();
    const itemCollection = collection(this.firestore, 'games');
    console.log(itemCollection);
    
    this.item$ = collectionData(itemCollection, { idField: 'id'});
    
    this.item$.subscribe((game)=> 
    console.log(game)
    )
  }

  newGame(){
    this.game = new Game();
    const itemCollection = collection(this.firestore, 'games');
    addDoc(itemCollection,{game: this.game.toJSON()})
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
