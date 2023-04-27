import { Component, OnInit } from '@angular/core';
import { TermoService } from '../service/termo.service';

@Component({
  selector: 'app-teste-confetes',
  templateUrl: './teste-confetes.component.html',
  styleUrls: ['./teste-confetes.component.css']
})
export class TesteConfetesComponent implements OnInit {
  
  containerEl!: HTMLElement;
  confettiFrequency = 3;
  confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E','#EFFF1D'];
  confettiAnimations = ['slow', 'medium', 'fast'];
  confettiInterval: any;

  constructor(private termo_service:TermoService) {}
  ngOnInit(): void {

    this.termo_service.recebeSinalGanhou.subscribe(()=>{
        const el = document.querySelector('.js-container') as HTMLElement;
        this._setupElements(el);
        this._renderConfetti();
    });
  }

  ngAfterViewInit() {
   
  }

    private _setupElements(el: HTMLElement): void {
    const containerEl = document.createElement('div');
    const elPosition = el.style.position;

    //  if (elPosition !== 'relative' || elPosition !== 'absolute') {
    el.style.position = 'relative';
    // }
    containerEl.classList.add('confetti-container');
  
    el.appendChild(containerEl);
  
    this.containerEl = containerEl;

  }

  private _renderConfetti(): void {
    this.confettiInterval = setInterval(() => {
        
      const confettiEl = document.createElement('div') as any;
        
      const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
      
      const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];

      const confettiLeft = (Math.floor(Math.random() * this.containerEl.offsetWidth)) + 'px';
      
      const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
      
      confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);

      console.log(confettiEl)

      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;
      console.log(confettiEl);

  
      const removeTimeout = setTimeout(function() {
        confettiEl.parentNode?.removeChild(confettiEl);
      }, 3000);
  
      // Define a propriedade removeTimeout como uma propriedade do elemento confettiEl
      confettiEl['removeTimeout'] = removeTimeout;
      
      this.containerEl.appendChild(confettiEl);
      }, 25);
  }
}


