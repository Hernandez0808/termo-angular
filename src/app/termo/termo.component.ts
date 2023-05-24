import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermoService } from '../service/termo.service';

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.css']
})
export class TermoComponent implements OnInit {

  constructor(private termo_service: TermoService, private elRef: ElementRef) { }
  resposta: string = '';
  tentativa_atual: number = 0;
  tentativas: any[] = [];
  letras_palavra: string[] = [];
  msgAviso: string = "";

  lst_alfabeto:string [] =[ 
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'backspace',
        'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'
      ]

  @ViewChildren('inputs', ) lst_inputs!:QueryList<ElementRef>;
  lst_inputs_sub!: Subscription;
  palavra_sorteada: string = "destruído";
  vh:number = 0;

  @HostListener('window:resize')
  onWindowResize() {
    this.atualizarAlturaVh();
  }

  // @HostListener('DOMContentLoaded')
  // onDomLoaded() {
    
  // }

  @HostListener('document:keydown', ['$event'])
  async onKeyDown(event: KeyboardEvent) {
    event.preventDefault();

    let objLinhaLetraFocus = this.objLinhaLetraFocus();
    
    if(!objLinhaLetraFocus){
      await this.focusPriEl();
      objLinhaLetraFocus = this.objLinhaLetraFocus();
    }
    console.log(objLinhaLetraFocus && event.key != 'Backspace' && event.key != 'Enter')
    if (objLinhaLetraFocus && event.key != 'Backspace' && event.key != 'Enter') {
      const {indexLinha, indexLetra} = objLinhaLetraFocus
      
      this.inputChange(event, '', indexLinha, indexLetra);
    }

    else if (event.key === 'Backspace') {
      this.backspaceUltEl();
    }

    else if (event.key === 'Enter') {
      this.enterTentativa();
    }

  }
  ngOnInit(): void {
    // this.vh = window.innerHeight * 0.01;
    // document.documentElement.style.setProperty('--vh', `${this.vh}px`);.
    this.atualizarAlturaVh();
    this.getPalavras();

  }

  atualizarAlturaVh() {
    this.vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${this.vh}px`);
  }

  async getPalavras() {
    this.tentativas = [];
    this.letras_palavra = [];
    this.termo_service.getFormasDePagamentos().subscribe(async (lst_palavras: any) => {
      this.palavra_sorteada = this.sorteiaPalavra(lst_palavras.lst_plavras_normais.filter((p: string) => p.length == 5)).toLocaleUpperCase();
      this.letras_palavra = this.palavra_sorteada.split('');
      console.log(this.palavra_sorteada);
        for (let i = 0; 5 >= i; i++) {
          let t: any[] = [];
          this.letras_palavra.forEach(() => {
            t.push('')
          });
          this.tentativas.push(t);
        }
      
 
      await this.focusPriEl();
    })
  }

  inputChange(event: any, tecla_click:string, indexTentativa: number, indexLetra: number) {
    let inputValue;
    if(event){
      inputValue = event.key;
    }else{
      inputValue = tecla_click;
    }

    const avanca_input = () => {
      let proximo_input = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra + 1}`) as HTMLInputElement;
      if (proximo_input) {
        proximo_input.value = '';
        setTimeout(() => {
          proximo_input?.focus();

        });
      }
    }

    if (!this.validarLetra(inputValue)) {

      this.tentativas[indexTentativa][indexLetra] = '';
      this.acionaFocusAtual(indexTentativa, indexLetra);

    } else {

      this.tentativas[indexTentativa][indexLetra] = inputValue.toUpperCase();

      setTimeout(() => {
        if(event){
          if (event.inputType == "insertText") {
            avanca_input();
          }
        }else if(tecla_click){
          avanca_input();
        }

      });
    }

    if (inputValue.length > 1) {
      this.tentativas[indexTentativa][indexLetra] = this.tentativas[indexTentativa][indexLetra][1];
    }

  }

  onKeyDownInputFocus(event: KeyboardEvent, indexTentativa: number, indexLetra: number) {

    const volta_input = () => {
      let input_anterior = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra - 1}`) as HTMLInputElement;
      if (input_anterior) {
        input_anterior?.focus();
      }
    }

    if (event.key === 'Backspace') {
      this.msgAviso = "";
      setTimeout(() => {
        let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;

        if (input_atual.value == '' && (indexLetra - 1) >= 0) {
          volta_input();

        } else {
          input_atual?.focus();
        }
      });
    }
  }

  sorteiaPalavra(lst_palavras: string[]): string {
    return lst_palavras[Math.floor(Math.random() * lst_palavras.length)];
  }

  validarLetra(letra: string): boolean {
    const regex = /^[a-zA-Z ]{1}$/;// aceita apenas letras sem acentos e espaços
    if (regex.test(letra)) {
      return true;
    } else {
      return false;
    }
  }

  handleMouseDown(event: MouseEvent) {
    const input = document.querySelector('input') as HTMLElement;
    if (!input.contains(event.target as Node)) {
      event.preventDefault();
    }
  }

  acionaFocusAtual(indexTentativa: number, indexLetra: number) {
    setTimeout(() => {
      let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;
      input_atual.focus();
    });
  }

  objLinhaLetraFocus(){
    const regex = /tentativa-(\d+)-letra-(\d+)/;
    let elemento_focus = this.elRef.nativeElement.querySelector(':focus');
    const resultado = regex.exec(elemento_focus?.id);
    if(resultado){
      const objReturn = {indexLinha:Number(resultado[1]), indexLetra:Number(resultado[2])};
      return objReturn;
    }
    return null;
  }

  async setLetra(letra_click:string){
    let objLinhaLetraFocus = this.objLinhaLetraFocus();
    
    if(!objLinhaLetraFocus){
      await this.focusPriEl();
      objLinhaLetraFocus = this.objLinhaLetraFocus();
    }

    if (objLinhaLetraFocus && letra_click != 'backspace' && letra_click != 'ENTER') {
      const {indexLinha, indexLetra} = objLinhaLetraFocus
      
      this.inputChange(null, letra_click, indexLinha, indexLetra);

    } else if(letra_click == 'backspace'){
      this.backspaceUltEl();

    } else if(letra_click == 'ENTER'){
      this.enterTentativa();
    }
  }

  backSpaceClick(indexTentativa: number, indexLetra: number) {
    const volta_input = () => {
      let input_anterior = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra - 1}`) as HTMLInputElement;
      if (input_anterior) {
        input_anterior?.focus();
      }
    }
    
    this.msgAviso = "";
    console.log(indexTentativa);
    this.tentativas[indexTentativa][indexLetra] = JSON.parse(JSON.stringify(''));
    setTimeout(() => {
      let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;
      
      if (input_atual.value == '' && (indexLetra - 1) >= 0) {
        volta_input();
        
      } else {
        input_atual?.focus();
      }
      });
  }

  backspaceUltEl(){
      const ultmElPreenc = this.tentativas[this.tentativa_atual].findLastIndex((element: string) => element != '');

      if (ultmElPreenc != -1) {
        this.tentativas[this.tentativa_atual][ultmElPreenc] = JSON.parse(JSON.stringify(''));

        setTimeout(() => {
          let input = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${ultmElPreenc}`) as HTMLElement;
          input?.focus();
        });
    }
  }

  focusPriEl(): Promise<void> {

    return new Promise((resolve) => {
      for (let i = 0; this.tentativas.length > i; i++) {
        const priEl = this.tentativas[i].findIndex((element: string) => element == '');
        console.log(priEl != -1);
        if (priEl != -1) {
          setTimeout(() => {
            let input = document.getElementById(`tentativa-${i}-letra-${priEl}`) as HTMLElement;
            input?.focus();
            resolve(); 
          });
          break;
        }
      }
    });
  }

  enterTentativa(){
    this.resposta = "";

      const linhaTotalmentePreenchida = this.tentativas[this.tentativa_atual].every((element: string) => element != '');
      const linhaTotalmenteVazia = this.tentativas[this.tentativa_atual].every((element: string) => element == '');
      if (linhaTotalmentePreenchida) {

        this.tentativas[this.tentativa_atual].forEach((letra: string) => {
          this.resposta = this.resposta + letra;
        });

        if (this.resposta == this.palavra_sorteada) {
          let atraso = 0;
          this.tentativas[this.tentativa_atual].forEach((letra: string, index:number) => {
            let l = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${index}`);
                setTimeout(() => {
                    l?.classList.add('flipInY');
                    l?.classList.add('existePosCorreta');
                }, 500 * atraso);
                atraso++;
          });
          this.termo_service.emitiSinalGanhou();
          this.tentativa_atual = 7;
              
        } else {

          let atraso = 0;
          this.tentativas[this.tentativa_atual].forEach((letra: string, index:number) => {
            let l = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${index}`);

            if(this.palavra_sorteada[index] == letra){
                setTimeout(() => {
                    l?.classList.add('flipInY');
                    l?.classList.add('existePosCorreta');
                }, 500 * atraso);
                atraso++;
            }else if(this.palavra_sorteada.includes(letra)){
              setTimeout(() => {
                l?.classList.add('flipInY');
                l?.classList.add('existePosErrada');
            }, 500 * atraso);
              atraso++;
            }else{
              setTimeout(() => {
                l?.classList.add('flipInY');
                l?.classList.add('naoExiste');
            }, 500 * atraso);
            atraso++;
            }
        });
          this.tentativa_atual++;
        }

      } else if (linhaTotalmenteVazia) {

        let tentativaVazia = document.getElementById('tentativa-' + this.tentativa_atual) as HTMLElement;
        tentativaVazia.classList.add('shake');

        setTimeout(() => {
          tentativaVazia.classList.remove('shake');
        }, 1000);

      } else {
        let tentativaAviso = document.getElementById('msg') as HTMLElement;

        tentativaAviso.classList.add('zoomIn');

        setTimeout(() => {
          tentativaAviso.classList.remove('zoomIn');
        }, 1000);

        this.msgAviso = 'Só palavras com ' + this.tentativas[this.tentativa_atual].length + ' letras';
      }
  }
    



}
