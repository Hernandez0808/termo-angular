import { Component, HostListener, OnInit } from '@angular/core';
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
  
        const linhaPreenchida = this.tentativas[this.tentativa_atual].every((element: string) => element != '');
        
        if (linhaPreenchida) {
          this.tentativas[this.tentativa_atual].forEach((letra:string)=>{
            this.resposta = this.resposta + letra;
          });
          console.log(this.resposta);

      }
    }
  }

  ngOnInit(): void {

    this.getPalavras();

    setTimeout(() => {
      let input = document.getElementById(`tentativa-0-letra-0`) as HTMLElement; 
      input?.focus();
    });
  }

  getPalavras() {
    this.tentativas = [];
    this.letras_palavra = [];
    this.termo_service.getFormasDePagamentos().subscribe((lst_palavras: any) => {
      this.palavra_sorteada = this.sorteiaPalavra(lst_palavras.lst_plavras_normais.filter((p: string) => p.length == 5))
      this.letras_palavra = this.palavra_sorteada.split('');

      for (let i = 0; 4 >= i; i++) {
        let t: any[] = [];
        this.letras_palavra.forEach(() => {
          t.push('')
        });
        this.tentativas.push(t);
      }
      console.log(this.tentativas)
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

    this.tentativas[indexTentativa][indexLetra] = inputValue.toUpperCase();

    if (!this.validarLetra(inputValue)) {
      this.tentativas[indexTentativa][indexLetra] = '';
    }

    if (inputValue.length > 1) {
      this.tentativas[indexTentativa][indexLetra] = this.tentativas[indexTentativa][indexLetra][1];
    }

    // const tentativas = JSON.parse(JSON.stringify(this.tentativas));
    // this.tentativas = JSON.parse(JSON.stringify(tentativas));

    setTimeout(() => {
      if (event.inputType == "insertText") {
        avanca_input();
      }

    });

  }

  onKeyDownInputFocus(event: KeyboardEvent, indexTentativa: number, indexLetra: number) {
    const volta_input = () => {
      let proximo_input = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra - 1}`) as HTMLInputElement;
      if (proximo_input) {
        proximo_input?.focus();
      }
    }

    if (event.key === 'Backspace') {
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

  acionaFocus(indexTentativa:number, indexLetra:number){
    setTimeout(() => {
      let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;
      input_atual.focus(); 
    });
  }

}
