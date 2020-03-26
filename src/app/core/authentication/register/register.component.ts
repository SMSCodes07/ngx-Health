import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirePerformance } from '@angular/fire/performance';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
   // Variable para el formulario de registro
   registerForm: FormGroup;
   // Variable para el formulario de registro
   // Variable para referenciar los modals
   modalReference: BsModalRef;
   // Variable para referenciar los modals
   // Objeto para mostrar la informacion del modal
   modalData = {
     modalTitle: null,
     modalIcon: null,
     modalDescription: null,
   };
   // Objeto para mostrar la informacion del modal
   // Variable para validar el registro
   registerSuccess = false;
   // Variable para validar el registro
  constructor(private router: Router, private modalService: BsModalService, private userAuth: AngularFireAuth,
              private realtimeDatabase: AngularFireDatabase, private formBuilder: FormBuilder,
              private appPerformance: AngularFirePerformance) { }

  ngOnInit(): void {
    // Inicializando formulario de registro
    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
    })
    // Inicializando formulario de registro
  }
  // Funcion para ir al login
  goToLogin() {
    this.router.navigate(['/login']);
  }
  // Funcion para ir al login
  // Funcion para crear un usuario en Firebase
  async createUser(registerModal: TemplateRef<any>) {
    // Extrayendo datos desde el formulario
    const userName = this.registerForm.value.userName;
    const userEmail = this.registerForm.value.userEmail;
    const userPassword = this.registerForm.value.userPassword;
    // Extrayendo datos desde el formulario
    // Creando usuario en el sistema
    await this.userAuth.auth.createUserWithEmailAndPassword(userEmail, userPassword)
    // Creando usuario en el sistema
    // En caso de un registro exitoso se ejecutara este codigo\
    .then(async () => {
      // Validando el registro
      this.registerSuccess = true;
      // Validando el registro
      // Actualizando objeto del usuario
      this.userAuth.auth.onAuthStateChanged((userData) => {
        userData.updateProfile({
          displayName: userName,
        })
        // Esto te permite ver toda la informacion de tu perfil en la consola, no seas timido. Indaga
        console.log(userData);
      });
      // Actualizando objeto del usuario
      // Extrayendo mi userID
      const userID = this.userAuth.auth.currentUser.uid;
      // Extrayendo mi userID
      // Extrayendo hora y fecha de registro
      const dateInfo = new Date();
      const regDate = (dateInfo.getDate() + '/' + (dateInfo.getMonth() + 1) + '/' + dateInfo.getFullYear());
      const regTime = (dateInfo.getHours() + ':' + dateInfo.getMinutes());
      // Extrayendo hora y fecha de registro
      // Creando registro en la base de datos
      await this.realtimeDatabase.database.ref('ngxHealthPlatform/users/' + userID + '/').set({
        userName: userName,
        userID: userID,
        userCases: 'Aqui van casos del usuario',
        userCurrentLocation: {
          userLatitude: '',
          userLongitude: '',
        },
        userEmail: userEmail,
        userRegisterDate: regDate,
        userRegisterTime: regTime,
      })
      // Creando registro en la base de datos
      // Notificando al usuario sobre el registro exitoso
      .then(() => {
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_done_a34v.png';
        this.modalData.modalTitle = '¡Registro exitoso!';
        this.modalData.modalDescription = 'Gracias por registrarte ' + userName + ', ya acceder a tu cuenta';
        setTimeout(() => {
          this.modalReference = this.modalService.show(registerModal);
        }, 1000);
      })
      // Notificando al usuario sobre el registro exitoso
      // En caso de que ocurra un extraño error con la base de datos manejamos el error aqui
      .catch((error) => {
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
        this.modalData.modalTitle = 'Error de autenticación';
        this.modalData.modalDescription = 'No pudimos acceder a la base de datos';
          setTimeout(() => {
          this.modalReference = this.modalService.show(registerModal);
        }, 1000);
      });
      // En caso de que ocurra un extraño error con la base de datos manejamos el error aqui
    })
    // En caso de un registro exitoso se ejecutara este codigo
    // En caso de un error, se ejecutara este codigo
    .catch(async (error) => {
      const errorCodes = error.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
          this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
          this.modalData.modalTitle = 'Error de autenticación';
          this.modalData.modalDescription = 'Dirección de correo invalida';
            setTimeout(() => {
            this.modalReference = this.modalService.show(registerModal);
          }, 500);
          break;
        case 'auth/email-already-in-use':
          this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
          this.modalData.modalTitle = 'Error de autenticación';
          this.modalData.modalDescription = 'La direccion de correo especificada esta vinculada a otra cuenta';
          setTimeout(() => {
            this.modalReference = this.modalService.show(registerModal);
          }, 500);
          break;
        case 'auth/operation-not-allowed':
          this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
          this.modalData.modalTitle = 'Error de autenticación';
          this.modalData.modalDescription = 'La operacion de registro ha sido deshabilitada';
          setTimeout(() => {
            this.modalReference = this.modalService.show(registerModal);
          }, 500);
          break;
        case 'auth/weak-password':
          this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
          this.modalData.modalTitle = 'Error de autenticación';
          this.modalData.modalDescription = 'Contraseña débil';
          setTimeout(() => {
            this.modalReference = this.modalService.show(registerModal);
          }, 500);
          break;
      }
    });
    // En caso de un error, se ejecutara este codigo
  }
  // Funcion para crear un usuario en Firebase
   // Funcion para ir al login
   continuousFunction() {
    if (this.registerSuccess === true) {
      this.modalReference.hide();
      this.router.navigate(['/login']);
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para ir al login
}
