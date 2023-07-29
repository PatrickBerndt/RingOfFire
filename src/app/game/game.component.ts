import { Component ,inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, updateDoc, doc, onSnapshot, getDoc, DocumentSnapshot, DocumentReference, CollectionReference, DocumentData, docData } from '@angular/fire/firestore';
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
  
  
  game!: Game;
  gameId: string;
  game$: Observable<any>;
  docSnap: any;
  docRef: any;
  private collection: CollectionReference<DocumentData>;
  

  constructor(private route: ActivatedRoute, public dialog: MatDialog,private firestore: Firestore){
    this.collection = collection(firestore, 'games');
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((param) => { this.gameId = param['id']
    this.setGameInstance();
    });
  }
    
  setGameInstance(){
   this.docRef = doc(this.collection, this.gameId);
    this.game$ = docData(this.docRef);
    this.game$.subscribe(currentGame => {
      this.game.players = currentGame.players;
      this.game.stack = currentGame.stack;
      this.game.playedCards = currentGame.playedCards;
      this.game.currentPlayer = currentGame.currentPlayer;
      this.game.currentCard = currentGame.currentCard;
      this.game.pickCardAnimation = currentGame.pickCardAnimation;

    });
     
  }
  

  newGame(){
    this.game = new Game();
  }

  takeCard(){
    if(!this.game.pickCardAnimation){
      this.game.currentCard = this.game.stack.pop()!;
      this.game.pickCardAnimation = true;
      if(this.game.currentPlayer < this.game.players.length -1){
        this.game.currentPlayer++;
      }else{
        this.game.currentPlayer= 0;
      }
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard)
        this.game.pickCardAnimation = false;
        this.saveGame();
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
      this.saveGame();
    });
  }

  saveGame(){
    updateDoc(this.docRef,this.game.toJSON())
  }

}
