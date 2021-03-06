import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, visibility, expand } from '../animations/app.animation';
import { switchMap } from 'rxjs/operators';
import { FeedbackService } from '../services/feedback.service';
import { baseURL } from '../shared/baseurl';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: { 
    '[@flyInOut]': 'true', 
    'style': 'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand(),
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  //dishcopy: Dish;
  feedbackcopy : Feedback = null;
  
  showSpinner = false;
  showFeedbackForm = true;
  showFeedback = false;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname' : '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.'
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name cannot be more than 25 characters long.'
    },
    'telnum':{
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email':{
      'required':'Email is required.',
      'email':'Email not in valid format.'
    }
  }

  constructor(private fb: FormBuilder, private feedbackservice: FeedbackService,
    private route: ActivatedRoute) {
    this.createForm();
   }

  ngOnInit(): void {

  }
  createForm(){
    this.feedbackForm = this.fb.group({
      firstname:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0,[Validators.required, Validators.pattern]],
      email: ['',[Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message:''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?:any){
    if (!this.feedbackForm){return;}
    const form = this.feedbackForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key]+' ';
            }
          }
        }
      }
    }

  }

  onSubmit(){
    this.feedback=this.feedbackForm.value;
    console.log(this.feedback);
    /*
    this.feedbackservice
      .submitFeedback(this.feedbackcopy)
      .subscribe(feedback => this.feedbackForm.value.push(feedback));
    */
    this.showFeedbackForm = false;
    this.feedbackservice
      .submitFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedbackcopy = feedback; this.feedback = null;
        setTimeout(()=>{
          this.feedbackcopy = null; this.showFeedbackForm = true
        }, 5000);
      },
      error => console.log(error.status, error.message)
      ); 
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum: 0,
      email:'',
      agree:false,
      contacttype:'None',
      message:''
    });
    this.feedbackFormDirective.resetForm();
  }

}
