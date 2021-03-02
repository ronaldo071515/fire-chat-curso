import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollection: AngularFirestoreCollection<Mensaje> | undefined;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public auth: AngularFireAuth) { 
                this.auth.authState.subscribe( user =>{
                  /* console.log('Estado del usuario', user); */

                  if ( !user ) {
                    return;
                  }

                  this.usuario.nombre = user.displayName;
                  this.usuario.uid = user.uid;

                })
              }

  cargarMensajes() {
    /* Realizar Query a firebase */
    this.chatsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.chatsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      /* console.log(mensajes); */

      this.chats = []

      for (let mensaje of mensajes) {
        this.chats.unshift( mensaje )
      }

      return mensajes;

      /* this.chats = mensajes; */
    }));
      /* al operador map() regresa un observable donde me puedosubscrubir con el metodo .subscribe() */
  }

  agregarMensaje( texto: string ) {
    //TODO falta uid del usuario 
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.chatsCollection?.add(mensaje);
  }

  login( metodo: string ) {

    if (metodo === 'google') {
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      this.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }

  }
  logout() {
    this.usuario = {};
    this.auth.signOut();
  }
}
