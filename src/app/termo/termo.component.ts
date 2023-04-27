import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { TermoService } from '../service/termo.service';

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.css']
})
export class TermoComponent implements OnInit {

  constructor(private termo_service: TermoService) { }
  resposta: string = '';
  tentativa_atual: number = 0;
  tentativas: any[] = [];
  letras_palavra: string[] = [];
  msgAviso: string = "";

  @ViewChildren('inputs', ) lst_inputs!:QueryList<ElementRef>;
  lst_inputs_sub!: Subscription;
  palavra_sorteada: string = "destruído";

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      for (let i = 0; this.tentativas.length > i; i++) {

        const ultmElPreenc = this.tentativas[i].findLastIndex((element: string) => element != '');

        if (ultmElPreenc != -1) {
          this.tentativas[i][ultmElPreenc] = '';

          setTimeout(() => {
            let input = document.getElementById(`tentativa-${i}-letra-${ultmElPreenc}`) as HTMLElement;
            input?.focus();
          });
        }
      }
    }

    if (event.key === 'Enter') {
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
          this.tentativa_atual = 6;
              
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

  ngOnInit(): void {

    this.getPalavras();

  }

  ngAfterViewInit(): void {

    // this.lst_inputs.changes.subscribe(() => {
    //   const firstElement = this.lst_inputs.first;
    //   if (firstElement) {
    //     firstElement.nativeElement.focus();
    //     this.lst_inputs_sub.unsubscribe();
    //   }
    // });
    // console.log();
  }

  // ngOnDestroy(): void {
  //   this.lst_inputs_sub.unsubscribe();
  // }

  

  getPalavras() {
    this.tentativas = [];
    this.letras_palavra = [];
    this.termo_service.getFormasDePagamentos().subscribe((lst_palavras: any) => {
      this.palavra_sorteada = this.sorteiaPalavra(lst_palavras.lst_plavras_normais.filter((p: string) => p.length == 5)).toLocaleUpperCase();
      this.letras_palavra = this.palavra_sorteada.split('');

      for (let i = 0; 4 >= i; i++) {
        let t: any[] = [];
        this.letras_palavra.forEach(() => {
          t.push('')
        });
        this.tentativas.push(t);
      }
    })
  }

  inputChange(event: any, indexTentativa: number, indexLetra: number) {
    const inputValue = event.target.value;

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
      console.log(indexTentativa, indexLetra)
      this.acionaFocusAtual(indexTentativa, indexLetra);

    } else {

      this.tentativas[indexTentativa][indexLetra] = inputValue.toUpperCase();

      setTimeout(() => {
        if (event.inputType == "insertText") {
          avanca_input();
        }

      });
    }

    if (inputValue.length > 1) {
      this.tentativas[indexTentativa][indexLetra] = this.tentativas[indexTentativa][indexLetra][1];
    }

    // const tentativas = JSON.parse(JSON.stringify(this.tentativas));
    // this.tentativas = JSON.parse(JSON.stringify(tentativas));

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
    const regex = /^[a-zA-Z ]+$/; // aceita apenas letras sem acentos e espaços
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

}
