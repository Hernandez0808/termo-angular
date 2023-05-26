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

  lst_alfabeto: string[] = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'backspace',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'
  ]

  regex_vogais = /[áàãâéèẽêíìĩîóòõôúùũûç]/i;
  regex_vogais_sem_acento = /[aeiouc]/i;
  lst_vogais_acentuadas: string[] = [];
  lst_palavras: string[] = [];

  lst_inputs_sub!: Subscription;
  palavra_sorteada: string = "destruído";
  vh: number = 0;

  @HostListener('window:resize')
  onWindowResize() {
    this.atualizarAlturaVh();
  }
  @HostListener('document:keydown', ['$event'])
  async onKeyDown(event: KeyboardEvent) {
    event.preventDefault();

    await this.focusPriEl();
    let objLinhaLetraFocus = this.objLinhaLetraFocus();

    if (objLinhaLetraFocus && event.key != 'Backspace' && event.key != 'Enter') {
      const { indexLinha, indexLetra } = objLinhaLetraFocus
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
    this.lst_vogais_acentuadas = [];
    this.termo_service.getPalavras().subscribe(async (objJson: any) => {
      this.lst_palavras = JSON.parse(JSON.stringify(objJson.lst_palavras));
      console.log(this.lst_palavras);
      this.palavra_sorteada = this.sorteiaPalavra(objJson.lst_palavras.filter((p: string) => p.length == 5)).toLocaleUpperCase();
      this.letras_palavra = this.palavra_sorteada.split('');

      for (let i = 0; this.palavra_sorteada.length >= i; i++) {
        let t: any[] = [];
        this.letras_palavra.forEach(() => {
          t.push('')
        });
        this.tentativas.push(t);

        if (this.regex_vogais.test(this.palavra_sorteada[i])) {
          this.lst_vogais_acentuadas.push(this.palavra_sorteada[i]);
        } else {
          this.lst_vogais_acentuadas.push('');
        }
      }


      await this.focusPriEl();
    })
  }

  sorteiaPalavra(lst_palavras: string[]): string {
    return lst_palavras[Math.floor(Math.random() * lst_palavras.length)];
  }

  async setLetraTecladoDigital(letra_click: string) {

    await this.focusPriEl();

    const objLinhaLetraFocus = this.objLinhaLetraFocus();

    if (objLinhaLetraFocus && letra_click != 'backspace' && letra_click != 'ENTER') {
      const { indexLinha, indexLetra } = objLinhaLetraFocus;
      this.inputChange(null, letra_click, indexLinha, indexLetra);

    } else if (letra_click == 'backspace') {
      this.backspaceUltEl();

    } else if (letra_click == 'ENTER') {

      this.enterTentativa();
    }

  }

  async inputChange(event: any, tecla_click: string, indexTentativa: number, indexLetra: number) {
    let inputValue;
    if (event) {
      inputValue = event.key;
    } else {
      inputValue = tecla_click;
    }

    if (!this.validarLetra(inputValue)) {

      await this.acionaFocusAtual(indexTentativa, indexLetra);
      this.tentativas[indexTentativa][indexLetra] = '';

    } else if (inputValue.length > 1 && this.validarLetra(inputValue)) {

      this.tentativas[indexTentativa][indexLetra] = JSON.parse(JSON.stringify(this.tentativas[indexTentativa][indexLetra][1]));
    }
    else {
      this.tentativas[indexTentativa][indexLetra] = JSON.parse(JSON.stringify(inputValue.toUpperCase()));
    }

    if (indexTentativa == this.tentativa_atual && indexLetra == 4) {
      await this.acionaFocusAtual(indexTentativa, indexLetra);
    }

  }

  validarLetra(letra: string): boolean {
    const regex = /^[a-zA-Z ]{1}$/;// aceita apenas letras sem acentos e espaços
    if (regex.test(letra)) {
      return true;
    } else {
      return false;
    }
  }

  async handleMouseDown() {
    await this.focusPriEl();
  }

  acionaFocusAtual(indexTentativa: number, indexLetra: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let input_atual = document.getElementById(`tentativa-${indexTentativa}-letra-${indexLetra}`) as HTMLInputElement;
        input_atual.focus();
        resolve();
      });
    });
  }

  objLinhaLetraFocus() {
    const regex = /tentativa-(\d+)-letra-(\d+)/;
    let elemento_focus = this.elRef.nativeElement.querySelector(':focus');
    const resultado = regex.exec(elemento_focus?.id);
    if (resultado) {
      const objReturn = { indexLinha: Number(resultado[1]), indexLetra: Number(resultado[2]) };
      return objReturn;
    }
    return null;
  }

 async enterTentativa() {
    this.resposta = "";

    const setClassMsg = () => {
      let tentativaAviso = document.getElementById('msg') as HTMLElement;

      tentativaAviso.classList.add('zoomIn');

      setTimeout(() => {
        tentativaAviso.classList.remove('zoomIn');
      }, 1000);
    }

    const linhaTotalmentePreenchida = this.tentativas[this.tentativa_atual].every((element: string) => element != '');
    const linhaTotalmenteVazia = this.tentativas[this.tentativa_atual].every((element: string) => element == '');
    if (linhaTotalmentePreenchida) {

      await this.montaRepostaDaMatriz();
      if(!this.palavraExisteBase(this.resposta)){
        setClassMsg();
        this.msgAviso = 'Esta palavra não existe na base de dados';

      }else if (this.resposta == this.palavra_sorteada) {

          
        let atraso = 0;
        this.tentativas[this.tentativa_atual].forEach(async (letra: string, index: number) => {
          let input = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${index}`) as HTMLInputElement;
  
          setTimeout(() => {
            input?.classList.add('flipInY');
            input?.classList.add('existePosCorreta');
          }, 500 * atraso);
          atraso++;
        });
          
 
        this.termo_service.emitiSinalGanhou();

        this.tentativa_atual = 7;

      } else {

        let atraso = 0;
        this.tentativas[this.tentativa_atual].forEach((letra: string, index: number) => {
          let l = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${index}`);


          if (this.palavra_sorteada[index] == this.resposta[index]) {

            setTimeout(() => {
              l?.classList.add('flipInY');
              l?.classList.add('existePosCorreta');

            }, 500 * atraso);

            atraso++;

          } else if (this.palavra_sorteada.includes(this.resposta[index]) || this.verificarVogalExisteComoAcentuada(this.resposta[index])) {

            setTimeout(() => {
              l?.classList.add('flipInY');
              l?.classList.add('existePosErrada');

            }, 500 * atraso);

            atraso++;

          } else {

            setTimeout(() => {
              l?.classList.add('flipInY');
              l?.classList.add('naoExiste');

            }, 500 * atraso);

            atraso++;
          }
        });
        this.tentativa_atual++;

        if (this.tentativa_atual == 6) {

          setClassMsg();
          this.msgAviso = 'Á palavra correta era: ' + this.palavra_sorteada;
        }

      }

    } else if (linhaTotalmenteVazia) {

      let tentativaVazia = document.getElementById('tentativa-' + this.tentativa_atual) as HTMLElement;
      tentativaVazia.classList.add('shake');

      setTimeout(() => {
        tentativaVazia.classList.remove('shake');
      }, 1000);

    } else {
      setClassMsg();
      this.msgAviso = 'Só palavras com ' + this.tentativas[this.tentativa_atual].length + ' letras';
    }
  }

  backspaceUltEl() {
    const ultmElPreenc = this.tentativas[this.tentativa_atual].findLastIndex((element: string) => element != '');

    if (ultmElPreenc != -1) {
      this.tentativas[this.tentativa_atual][ultmElPreenc] = JSON.parse(JSON.stringify(''));

      setTimeout(() => {
        let input = document.getElementById(`tentativa-${this.tentativa_atual}-letra-${ultmElPreenc}`) as HTMLElement;
        input?.focus();
      });
    }
  }

  async focusPriEl(): Promise<void> {
    for (let i = 0; i < this.tentativas.length; i++) {
      const priEl = this.tentativas[i].findIndex((element: string) => element === '');

      if (priEl !== -1) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            const input = document.getElementById(`tentativa-${i}-letra-${priEl}`) as HTMLElement;
            input?.focus();
            resolve();
          });
        });
        break;
      }
    }
  }

  montaRepostaDaMatriz():Promise<void>{
    return new Promise((resolve)=>{
      this.tentativas[this.tentativa_atual].forEach((letra: string, index: number) => {

        if (this.lst_vogais_acentuadas[index]) {
          const vogal_acentuada = this.lst_vogais_acentuadas[index];
          if (letra == this.lst_vogais_acentuadas[index].normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
            this.resposta += vogal_acentuada;
            
          } else {
            this.resposta += letra;
          }
        } else {

          this.resposta += letra;
        }

      });
      resolve();
    });
  }

  letraComAcento(letra:string, indexTentativa:number, indexLetra:number):string{
    if(this.tentativa_atual != indexTentativa){
      if(this.regex_vogais_sem_acento.test(letra)){
        if (this.lst_vogais_acentuadas[indexLetra]) {
          const vogal_acentuada = this.lst_vogais_acentuadas[indexLetra];
          if (letra == this.lst_vogais_acentuadas[indexLetra].normalize('NFD').replace(/[\u0300-\u036f]/g, '')) {
            return vogal_acentuada;
          }
        }
      }
    }

    return letra; 
  }

  verificarVogalExisteComoAcentuada(letra:string):boolean {
    let vogal_existe_como_acentuada:boolean = false;
    this.lst_vogais_acentuadas.forEach((letraAcentuada:string)=>{
      if(letraAcentuada.normalize('NFD').replace(/[\u0300-\u036f]/g, '') == letra){
        vogal_existe_como_acentuada = true;
      }
    });
    return vogal_existe_como_acentuada;
  }

  palavraExisteBase(resposta: string): boolean {
    return this.lst_palavras.filter((p: string) => p.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === resposta).length > 0;
  }



}
