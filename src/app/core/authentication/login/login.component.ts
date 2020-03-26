import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirePerformance } from '@angular/fire/performance';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Variable para el formulario de login
  loginForm: FormGroup;
  passwordForm: FormGroup;
  // Variable para el formulario de login
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
  // Variable para validar el login
  loginSuccess = false;
  // Variable para validar el login
 constructor(private router: Router, private modalService: BsModalService, private userAuth: AngularFireAuth,
             private realtimeDatabase: AngularFireDatabase, private formBuilder: FormBuilder,
             private appPerformance: AngularFirePerformance) { }

 ngOnInit(): void {
   // Inicializando formulario de login
   this.loginForm = this.formBuilder.group({
     userEmail: ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
     userPassword: ['', [Validators.required, Validators.minLength(6)]],
   })
   // Inicializando formulario de login
   // Inicializando formulario de recuperacion de cuentas
   this.passwordForm = this.formBuilder.group({
    userEmail: ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ]
   });
   // Inicializando formulario de recuperacion de cuentas
 }
 // Funcion para ir al registro
 goToRegister() {
   this.router.navigate(['/register']);
 }
 // Funcion para ir al registro
 // Funcion para iniciar la sesion del usuario
 async loginUser(loginModal: TemplateRef<any>) {
  // Extrayendo datos desde el formulario
  const userEmail = this.loginForm.value.userEmail;
  const userPassword = this.loginForm.value.userPassword;
  // Extrayendo datos desde el formulario
  // Iniciando la sesion del usuario
  await this.userAuth.auth.signInWithEmailAndPassword(userEmail, userPassword)
  // Iniciando la sesion del usuario
  // Notificando al usuario sobre el login exitoso
  .then(() => {
    // Validando el login
    this.loginSuccess = true;
    // Validando el login
    // Extrayendo el nombre del usuario
    const userName = this.userAuth.auth.currentUser.displayName;
    // Extrayendo el nombre del usuario
    this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_done_a34v.png';
    this.modalData.modalTitle = '¡Iniciar sesión!';
    this.modalData.modalDescription = 'Bienvenido ' + userName + ', disfruta de nuestros servicios';
    setTimeout(() => {
      this.modalReference = this.modalService.show(loginModal);
    }, 1000);
  })
  // Notificando al usuario sobre el login exitoso
  // En caso de un error, se ejecutara esta linea de codigo
  .catch((error) => {
    const errorCodes = error.code;
    switch (errorCodes) {
      case 'auth/invalid-email':
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
        this.modalData.modalTitle = 'Error de autenticación';
        this.modalData.modalDescription = 'La direccón de correo introducida es invalida';
        setTimeout(() => {
      this.modalReference = this.modalService.show(loginModal);
    }, 1000);
        break;
      case 'auth/user-disabled':
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
        this.modalData.modalTitle = 'Error de autenticación';
        this.modalData.modalDescription = 'Estimado usuario, la cuenta vinculada a la dirección de correo introducida ha sido inhabilitada';
        setTimeout(() => {
      this.modalReference = this.modalService.show(loginModal);
    }, 1000);
        break;
      case 'auth/user-not-found':
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
        this.modalData.modalTitle = 'Error de autenticación';
        this.modalData.modalDescription = 'No existe cuenta alguna vinculada a la dirección de correo introducida';
        setTimeout(() => {
      this.modalReference = this.modalService.show(loginModal);
    }, 1000);
        break;
      case 'auth/wrong-password':
        this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_cancel_u1it.png';
        this.modalData.modalTitle = 'Error de autenticación';
        this.modalData.modalDescription = 'Contraseña incorrecta';
        setTimeout(() => {
      this.modalReference = this.modalService.show(loginModal);
    }, 1000);
        break;
    }
  });
  // En caso de un error, se ejecutara esta linea de codigo
 }
 // Funcion para iniciar la sesion del usuario
 // Funcion para mostrar el modal de la contraseña
 showPasswordModal(passwordModal: TemplateRef<any>) {
    this.modalData.modalIcon = '../../../../../assets/ilustrations/undraw_authentication_fsn5.png',
    this.modalData.modalTitle = 'Recuperación de cuentas',
    this.modalData.modalDescription = 'Introduzca la dirección de correo electrónico vinculada a su cuenta, luego enviaremos un enlace de recuperación';
    setTimeout(() => {
      this.modalReference = this.modalService.show(passwordModal);
    }, 1000);
 }
 // Funcion para mostrar el modal de la contraseña
 // Funcion para recuperar la contraseña
 async recoverPassword() {
  // Extrayendo datos del formulario de recuperacion de cuentas
  const emailToRecover = this.passwordForm.value.userEmail;
  // Extrayendo datos del formulario de recuperacion de cuentas
  // Enviando enlace
  await this.userAuth.auth.sendPasswordResetEmail(emailToRecover)
  // Enviando enlace
  // Cerrando el modal
  .then(() => {
    this.modalReference.hide();
  })
  // Cerrando el modal
 }
 // Funcion para recuperar la contraseña
  // Funcion para acceder dentro del panel
  goToDashboard() {
    if (this.loginSuccess === true) {
      this.modalReference.hide();
      this.router.navigate(['/dashboard']);
    } else {
      this.modalReference.hide();
    }
  }
  // Funcion para acceder dentro del panel




}
