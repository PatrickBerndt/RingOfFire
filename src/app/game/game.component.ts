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
  
  pickCardAnimation = false; 
  currentCard: string = '';
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
    const docRef = doc(this.collection, this.gameId);
    this.game$ = docData(this.docRef);
    this.game$.subscribe(currentGame => {
      this.game.players = currentGame.players;
      this.game.stack = currentGame.stack;
      this.game.playedCards = currentGame.playedCards;
      this.game.currentPlayer = currentGame.currentPlayer;
    });
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
    const itemCollection = doc(this.firestore, 'games', this.gameId);
    updateDoc(itemCollection, {game: this.game.toJSON()})
  }

}
