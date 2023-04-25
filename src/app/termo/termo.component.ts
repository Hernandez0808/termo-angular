import { Component, OnInit } from '@angular/core';
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

  previousValue = '';

  handleInput(event:any, indexTentativa: number, indexLetra: number) {
    const inputValue = event.target.value;;
    const avanca_input = () =>{
      let proximo_input = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra + 1}`) as HTMLInputElement;
      if (proximo_input) {
        proximo_input.value = '';
        setTimeout(() => {
          proximo_input?.focus();
          
        });
      }
    }
    const volta_input = () =>{
      let proximo_input = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra - 1}`) as HTMLInputElement;
      if (proximo_input) {
        setTimeout(() => {
          proximo_input?.focus();
          
        });
      }
    }
    console.log(event)
    this.previousValue = inputValue;
    this.tentativas[indexTentativa][indexLetra] = inputValue;
    
    if(!this.validarLetra(inputValue)){
        this.tentativas[indexTentativa][indexLetra] = '';
    }
    
    if(inputValue.length > 1){
        console.log(this.tentativas[indexTentativa][indexLetra]);
        this.tentativas[indexTentativa][indexLetra] = this.tentativas[indexTentativa][indexLetra][1];
      }
      
      const tentativas = JSON.parse(JSON.stringify(this.tentativas));
      this.tentativas = JSON.parse(JSON.stringify(tentativas));
      
      setTimeout(() => { 
        if(event.inputType == "deleteContentBackward"){
          volta_input();
        }else{
          avanca_input();
        }
    });
    
    
    
  }

  ngOnInit(): void {

    this.getPalavras();
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

  insere_caracter(indexTentativa: number, indexLetra: number) {

    let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;

    if (input_atual.value.length > 1) {
      input_atual.value = this.previousValue;
    }

    this.previousValue = input_atual.value;

    setTimeout(() => {


      if (!this.validarLetra(input_atual.value)) {
        this.tentativas[indexTentativa][indexLetra] = '';
        input_atual.value = '';

        setTimeout(() => {
          input_atual?.focus();
        });

      } else {



      }

    });

  }

}
