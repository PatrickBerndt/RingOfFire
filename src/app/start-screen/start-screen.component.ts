import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  game!: Game;
  item$: Observable<import("@angular/fire/firestore").DocumentData[]>;

  constructor(private router: Router){

  };

  newGame(){
    this.game = new Game();
    const itemCollection = collection(this.firestore, 'games');
    addDoc(itemCollection,{game: this.game.toJSON()})
    this.item$ = collectionData(itemCollection, {idField: 'id'} );
    this.item$.subscribe((game)=>{console.log(game);
    })
    




    //this.router.navigateByUrl('/game/');
  }


}
