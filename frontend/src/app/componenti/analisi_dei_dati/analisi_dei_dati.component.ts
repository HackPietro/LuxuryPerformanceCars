import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from "../../Service/service";
import {forkJoin} from "rxjs";


Chart.register(...registerables);

@Component({
  selector: 'app-analisi_dei_dati',
  templateUrl: './analisi_dei_dati.component.html',
  styleUrls: ['./analisi_dei_dati.component.css']
})
export class Analisi_dei_datiComponent implements OnInit {
  brands: string[] = []; // Lista delle marche disponibili
  selectedBrand: string = ''; // Marca selezionata
  showBrandSelector: boolean = false;
  models: string[] = [];
  selectedModel: string = '';
  showBrandModelSelector: boolean = false;

  clickCountChart: Chart | undefined; // Dichiarazione della variabile del grafico



  constructor(private http: HttpClient, private service: ServiceService) {}

  ngOnInit(): void {
    this.loadAvailableBrands(); //ok
    this.loadPriceFrequencyCharts(); //ok
    this.loadDoorPercentageChart(); //ok
    this.loadNeoDriversChart(); //ok
    this.loadBrandFrequencyChart(); //ok
    this.loadEnhancedBrandModelChart();
    this.loadKilometraggioCharts(); //ok
    this.loadYearCharts(); //ok
    this.loadCambioPercentageChart(); //ok
    this.loadCarburantePercentageChart(); //ok
    this.loadCategoriaPercentageChart(); //ok
    this.loadClickCount();
  }

  onChartSelect(event: Event): void {
    // Nascondi tutti i grafici
    const chartContainers = document.querySelectorAll('.chart-container') as NodeListOf<HTMLElement>;
    chartContainers.forEach(container => {
      container.style.display = 'none';
    });

    // Mostra il grafico selezionato
    const selectedChart = (event.target as HTMLSelectElement).value;
    if (selectedChart) {
      const selectedContainer = document.getElementById(`${selectedChart}-container`);
      if (selectedContainer) {
        selectedContainer.style.display = 'block';
      }
    }

    // Gestisci la visibilità del selettore della marca
    this.showBrandSelector = selectedChart === 'stackedBarChartBrandModels' || selectedChart === 'stackedBarClickCount';
    this.showBrandModelSelector = selectedChart === 'stackedBarClickCount';

    if (selectedChart === 'stackedBarClickCount') {
      // Carica i modelli per la marca selezionata
      if (this.selectedBrand) {
        this.loadModelsForBrand(this.selectedBrand); // Assicurati di avere un metodo che carica i modelli
      }
    }
  }

  loadModelsForBrand(brand: string): void {
    this.service.getModelliByMarca(brand).subscribe({
      next: (models: string[]) => {
        // Aggiungi un'opzione vuota come primo elemento
        this.models = ['', ...models]; // Il primo valore è vuoto, quindi obbliga l'utente a selezionare un modello
        if (this.models.length === 1) {  // Se l'unico modello è vuoto, resetta la selezione del modello
          this.selectedModel = '';
        }
      },
      error: (err: any) => {
        console.error('Errore nel recupero dei modelli:', err);
        this.models = []; // Lista vuota in caso di errore
        this.selectedModel = ''; // Reset del modello
      }
    });
  }

  loadAvailableBrands(): void {
    this.service.getMarche().subscribe({
      next: (marche: string[]) => {
        this.brands = marche;
        this.selectedBrand = this.brands.length > 0 ? this.brands[0] : ''; // Imposta la marca predefinita
        if (this.selectedBrand) {
          this.loadModelsForBrand(this.selectedBrand); // Carica i modelli per il brand predefinito
        }
      },
      error: (err: any) => {
        this.brands = []; // In caso di errore, lista vuota
      }
    });
  }

  onBrandSelect(event: Event): void {
    this.selectedBrand = (event.target as HTMLSelectElement).value;

    // Reset del modello selezionato quando cambia il brand
    this.selectedModel = ''; // Mantieni il modello vuoto per consentire la selezione manuale

    if (this.selectedBrand) {
      this.loadModelsForBrand(this.selectedBrand); // Carica i modelli per il nuovo brand selezionato
      this.loadEnhancedBrandModelChart()
    }

    // Aggiorna il grafico dopo aver cambiato il brand
    this.loadClickCount(); // Chiama un metodo per aggiornare il grafico
  }

  onModelSelect(event: Event): void {
    this.selectedModel = (event.target as HTMLSelectElement).value;

    // Aggiorna il grafico quando selezioni un modello
    if (this.selectedModel) {
      this.loadClickCount(); // Chiama un metodo per aggiornare il grafico con il modello selezionato
    }
  }

  loadClickCount(): void {
    if (!this.selectedBrand || !this.selectedModel) {
      return;
    }

    this.service.findByMarcaAndModello(this.selectedBrand, this.selectedModel).subscribe({
      next: (data: any) => {
        // Estrai le etichette (categorie) dalla mappa
        const labels = data.map((item: any) => Object.keys(item)[0]);  // Estrae la chiave della mappa
        // Estrai i valori corrispondenti dalle voci della mappa
        const values = data.map((item: any) => Object.values(item)[0]);  // Estrae il valore corrispondente alla chiave

        // Se il grafico esiste già, distruggilo
        if (this.clickCountChart) {
          this.clickCountChart.destroy();
        }

        // Crea un nuovo grafico a barre e memorizza il riferimento
        this.clickCountChart = new Chart('stackedBarClickCount', {  // Usa l'ID corretto del canvas
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Click Count',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            },
            plugins: {
              datalabels: {
                anchor: 'end',
                align: 'top',
                color: 'black'
              }
            }
          }
        });
      },
      error: (err: any) => {
        console.error('Errore nel recupero dei dati per il grafico:', err);
      }
    });
  }


  loadPriceFrequencyCharts(): void {
    // Ottieni i dati per i prezzi minimi e massimi
    forkJoin({
      minPrices: this.service.getPrezziMinFromSavedSearches(),
      maxPrices: this.service.getPrezziMaxFromSavedSearches()
    }).subscribe(({ minPrices, maxPrices }) => {
      // Calcola le frequenze per i prezzi minimi
      const minPriceFrequencies = this.calculateFrequency1(minPrices);
      const minPricesData = Array.from(minPriceFrequencies.keys());
      const minCounts = Array.from(minPriceFrequencies.values());

      // Calcola le frequenze per i prezzi massimi
      const maxPriceFrequencies = this.calculateFrequency1(maxPrices);
      const maxPricesData = Array.from(maxPriceFrequencies.keys());
      const maxCounts = Array.from(maxPriceFrequencies.values());

      // Grafico dei prezzi minimi
      new Chart('barChartMin', {
        type: 'bar',
        data: {
          labels: minPricesData,
          datasets: [
            {
              label: 'Prezzi Minimi (Frequenza)',
              data: minCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Prezzi Minimi' } },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Frequenza di ricerca' },
              ticks: {
                stepSize: 1,
                callback: value => (Number.isInteger(value) ? value : null),
              },
            }
          }
        }
      });

      // Grafico dei prezzi massimi
      new Chart('barChartMax', {
        type: 'bar',
        data: {
          labels: maxPricesData,
          datasets: [
            {
              label: 'Prezzi Massimi (Frequenza)',
              data: maxCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Prezzi Massimi' } },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Frequenza di ricerca' },
              ticks: {
                stepSize: 1,
                callback: value => (Number.isInteger(value) ? value : null),
              },
            }
          }
        }
      });
    });
  }

// Metodo per calcolare la frequenza dei valori in un array
  private calculateFrequency1(data: number[]): Map<number, number> {
    const frequencyMap = new Map<number, number>();
    data.forEach(price => {
      const count = frequencyMap.get(price) || 0;
      frequencyMap.set(price, count + 1);
    });
    return frequencyMap;
  }

  loadDoorPercentageChart(): void {
    this.service.getPorteFromSavedSearches().subscribe(
      (porte: number[]) => {
        // Conta le occorrenze di ciascun numero di porte
        const porteCount = porte.reduce((acc, num) => {
          acc[num] = (acc[num] || 0) + 1; // Incrementa il contatore
          return acc;
        }, {} as Record<number, number>);

        // Converti i dati in formato per il grafico
        const doorData = Object.entries(porteCount).map(([doors, count]) => ({
          doors: +doors,
          count: count
        }));

        const doorLabels = doorData.map(item => `Auto ${item.doors} porte`);
        const doorCounts = doorData.map(item => item.count);

        // Calcolo del totale
        const total = doorCounts.reduce((sum, value) => sum + value, 0);

        // Crea il grafico
        new Chart('pieChartDoors', {
          type: 'pie',
          data: {
            labels: doorLabels,
            datasets: [
              {
                data: doorCounts,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                formatter: (value, context) => {
                  const percentage = ((value / total) * 100).toFixed(1); // Calcolo percentuale
                  return `${percentage}%`; // Mostra la percentuale
                },
                color: '#fff', // Colore del testo
                font: {
                  size: 14,
                  weight: 'bold' // Testo in grassetto
                },
                textStrokeColor: 'rgba(0, 0, 0, 0.5)', // Bordo leggero al testo
                textStrokeWidth: 2
              }
            }
          },
          plugins: [ChartDataLabels] // Registrazione del plugin
        });
      },
      (error) => {
        console.error('Errore nel caricamento dei dati delle porte:', error);
      }
    );
  }

  loadNeoDriversChart(): void {
    this.service.getNeopatentatiFromSavedSearches().subscribe(
      (neopatentati: boolean[]) => {
        // Conta le occorrenze di `true` (Sì) e `false` (No)
        const counts = neopatentati.reduce(
          (acc, isNeo) => {
            if (isNeo) {
              acc.si++; // Incrementa il contatore per "Sì"
            } else {
              acc.no++; // Incrementa il contatore per "No"
            }
            return acc;
          },
          { si: 0, no: 0 } // Valori iniziali
        );

        // Prepara i dati per il grafico
        const neoDriversData = [
          { label: 'Sì', count: counts.si },
          { label: 'No', count: counts.no }
        ];

        const neoLabels = neoDriversData.map(item => item.label);
        const neoCounts = neoDriversData.map(item => item.count);

        // Crea il grafico con il plugin datalabels
        new Chart('pieChartNeoDrivers', {
          type: 'pie',
          plugins: [ChartDataLabels], // Registra il plugin
          data: {
            labels: neoLabels,
            datasets: [
              {
                data: neoCounts,
                backgroundColor: ['rgba(255, 159, 64, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                formatter: (value: number, context: any) => {
                  // Cast esplicito per evitare errori
                  const data = context.chart.data.datasets[0].data as number[];

                  // Somma totale con riduzione tipizzata
                  const total: number = data.reduce((a: number, b: number) => a + b, 0);

                  // Calcolo della percentuale
                  const percentage: string = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                },
                color: '#fff', // Testo bianco
                font: {
                  size: 14,
                  weight: 'bold'
                },
                textStrokeColor: 'rgba(0, 0, 0, 0.5)',
                textStrokeWidth: 2
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel caricamento dei dati per i neopatentati:', error);
      }
    );
  }


  loadBrandFrequencyChart(): void {
    // Ottieni tutte le marche disponibili
    this.service.getMarche().subscribe({
      next: (marche: string[]) => {
        this.brands = marche; // Imposta le marche disponibili

        // Ottieni le marche salvate nelle ricerche
        this.service.getMarcheFromSavedSearches().subscribe({
          next: (savedBrands: string[]) => {
            // Conta le occorrenze delle marche salvate
            const savedBrandFrequency = savedBrands.reduce((acc: Record<string, number>, brand: string) => {
              acc[brand] = (acc[brand] || 0) + 1;
              return acc;
            }, {});

            // Assicurati che tutte le marche abbiano un conteggio (0 se non presente)
            const brandData = this.brands.map(brand => ({
              brand: brand,
              count: savedBrandFrequency[brand] || 0
            }));

            // Estrai i dati per il grafico
            const brandLabels = brandData.map(item => item.brand);
            const brandCounts = brandData.map(item => item.count);

            // Crea il grafico
            new Chart('barChartBrands', {
              type: 'bar',
              data: {
                labels: brandLabels,
                datasets: [
                  {
                    label: 'Frequenza Marche',
                    data: brandCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  }
                ]
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Frequenza di ricerca' },
                    ticks: {
                      stepSize: 1,
                      callback: value => (Number.isInteger(value) ? value : null),
                    },
                  }
                }
              }
            });
          },
          error: (err: any) => {
            window.alert(`Errore durante il recupero delle marche salvate: ${err.message}`);
          }
        });
      },
      error: (err: any) => {
        window.alert('Errore durante il recupero delle marche disponibili');
      }
    });
  }

  loadEnhancedBrandModelChart(): void {
    // Rimuove il vecchio canvas e lo ricrea per evitare conflitti
    const existingCanvas = document.getElementById('stackedBarChartBrandModels');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const canvasContainer = document.getElementById('stackedBarChartBrandModels-container');
    if (canvasContainer) {
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'stackedBarChartBrandModels';
      canvasContainer.appendChild(newCanvas);
    }

    // Verifica se è stata selezionata una marca
    if (!this.selectedBrand) {
      const ctx = document.getElementById('stackedBarChartBrandModels') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [], // Nessun dato iniziale
            datasets: []
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
            scales: {
              x: { title: { display: true, text: 'Modelli' } },
              y: { beginAtZero: true, title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      }
      return; // Termina l’esecuzione se non c’è una marca selezionata
    }

    // Recupera i dati dal servizio
    this.service.getModelliDiUnaMarcaFromSavedSearches(this.selectedBrand).subscribe(
      (modelli: string[]) => {
        const modelCountsMap = modelli.reduce<Record<string, number>>((acc, modello) => {
          acc[modello] = (acc[modello] || 0) + 1;
          return acc;
        }, {});

        const modelNames = Object.keys(modelCountsMap);
        const modelCounts = Object.values(modelCountsMap);

        // Creazione del grafico con i dati effettivi
        const ctx = document.getElementById('stackedBarChartBrandModels') as HTMLCanvasElement;
        if (ctx) {
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: modelNames,
              datasets: [
                {
                  label: `Modelli di ${this.selectedBrand}`,
                  data: modelCounts,
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.dataset.label}: ${context.raw} ricerche`;
                    }
                  }
                }
              },
              scales: {
                x: { title: { display: true, text: 'Modelli' } },
                y: { beginAtZero: true, title: { display: true, text: 'Frequenza di ricerca' },
                  ticks: {
                    stepSize: 1,
                    callback: value => (Number.isInteger(value) ? value : null),
                  },
                }
              }
            }
          });
        }
      },
      (error) => {
        console.error('Errore nel recupero dei dati dei modelli:', error);
      }
    );
  }


  loadKilometraggioCharts(): void {
    // Ottieni i chilometraggi minimi e massimi dal server
    this.service.getKmMinFromSavedSearches().subscribe(
      (minKmData: number[]) => {
        // Calcola la frequenza dei chilometraggi minimi
        const minKmCounts = this.calculateFrequency2(minKmData);
        const minKm = Array.from(minKmCounts.keys());

        // Grafico per Chilometraggio Minimo
        new Chart('barChartMinKm', {
          type: 'bar',
          data: {
            labels: minKm,
            datasets: [
              {
                label: 'Chilometraggio Minimo (Frequenza)',
                data: Array.from(minKmCounts.values()),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.raw} ricerche`;
                  }
                }
              }
            },
            scales: {
              x: { title: { display: true, text: 'Chilometraggio Minimo (km)' } },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel caricamento dei chilometraggi minimi:', error);
      }
    );

    this.service.getKmMaxFromSavedSearches().subscribe(
      (maxKmData: number[]) => {
        // Calcola la frequenza dei chilometraggi massimi
        const maxKmCounts = this.calculateFrequency2(maxKmData);
        const maxKm = Array.from(maxKmCounts.keys());

        // Grafico per Chilometraggio Massimo
        new Chart('barChartMaxKm', {
          type: 'bar',
          data: {
            labels: maxKm,
            datasets: [
              {
                label: 'Chilometraggio Massimo (Frequenza)',
                data: Array.from(maxKmCounts.values()),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.raw} ricerche`;
                  }
                }
              }
            },
            scales: {
              x: { title: { display: true, text: 'Chilometraggio Massimo (km)' } },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel caricamento dei chilometraggi massimi:', error);
      }
    );
  }

// Funzione di supporto per calcolare la frequenza
  private calculateFrequency2(data: number[]): Map<number, number> {
    const frequencyMap = new Map<number, number>();

    data.forEach(km => {
      frequencyMap.set(km, (frequencyMap.get(km) || 0) + 1);
    });

    return frequencyMap;
  }


  loadYearCharts(): void {
    // Ottieni gli anni da e a dal server
    this.service.getAnnoMinFromSavedSearches().subscribe(
      (yearFromData: number[]) => {
        // Calcola la frequenza degli anni "Da"
        const yearFromCounts = this.calculateFrequency3(yearFromData);
        const yearFrom = Array.from(yearFromCounts.keys());

        // Grafico per Anno Da
        new Chart('barChartYearFrom', {
          type: 'bar',
          data: {
            labels: yearFrom,
            datasets: [
              {
                label: 'Anno Da (Frequenza)',
                data: Array.from(yearFromCounts.values()),
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.raw} ricerche`;
                  }
                }
              }
            },
            scales: {
              x: { title: { display: true, text: 'Anno Da' } },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel caricamento degli anni "Da":', error);
      }
    );

    this.service.getAnnoMaxFromSavedSearches().subscribe(
      (yearToData: number[]) => {
        // Calcola la frequenza degli anni "A"
        const yearToCounts = this.calculateFrequency3(yearToData);
        const yearTo = Array.from(yearToCounts.keys());

        // Grafico per Anno A
        new Chart('barChartYearTo', {
          type: 'bar',
          data: {
            labels: yearTo,
            datasets: [
              {
                label: 'Anno A (Frequenza)',
                data: Array.from(yearToCounts.values()),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: 'top' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.raw} ricerche`;
                  }
                }
              }
            },
            scales: {
              x: { title: { display: true, text: 'Anno A' } },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel caricamento degli anni "A":', error);
      }
    );
  }

// Funzione di supporto per calcolare la frequenza
  private calculateFrequency3(data: number[]): Map<number, number> {
    const frequencyMap = new Map<number, number>();

    data.forEach(year => {
      frequencyMap.set(year, (frequencyMap.get(year) || 0) + 1);
    });

    return frequencyMap;
  }

  loadCambioPercentageChart(): void {
    this.service.getCambioFromSavedSearches().subscribe(
      (cambio: string[]) => {
        // Conta le occorrenze di ciascun tipo di cambio
        const cambioCount = cambio.reduce((acc, tipo) => {
          acc[tipo] = (acc[tipo] || 0) + 1; // Incrementa il contatore
          return acc;
        }, {} as Record<string, number>);

        // Converti i dati in formato per il grafico
        const cambioData = Object.entries(cambioCount).map(([tipo, count]) => ({
          tipo: tipo,
          count: count
        }));

        const cambioLabels = cambioData.map(item => item.tipo);
        const cambioCounts = cambioData.map(item => item.count);

        // Calcolo del totale
        const total = cambioCounts.reduce((sum, value) => sum + value, 0);

        // Crea il grafico
        new Chart('pieChartCambio', {
          type: 'pie',
          data: {
            labels: cambioLabels,
            datasets: [
              {
                data: cambioCounts,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.5)',
                  'rgba(54, 162, 235, 0.5)'
                ], // Colori per Automatico e Manuale
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                formatter: (value, context) => {
                  const percentage = ((value / total) * 100).toFixed(1); // Calcolo percentuale
                  return `${percentage}%`; // Mostra la percentuale
                },
                color: '#fff', // Colore del testo
                font: {
                  size: 14,
                  weight: 'bold' // Testo in grassetto
                },
                textStrokeColor: 'rgba(0, 0, 0, 0.5)', // Bordo leggero al testo
                textStrokeWidth: 2
              }
            }
          },
          plugins: [ChartDataLabels] // Registrazione del plugin
        });
      },
      (error) => {
        console.error('Errore nel caricamento dei dati del cambio:', error);
      }
    );
  }

  loadCarburantePercentageChart(): void {
    this.service.getCarburanteFromSavedSearches().subscribe({
      next: (carburante: string[]) => {
        // Conta le occorrenze di ciascun tipo di carburante
        const carburanteCount = carburante.reduce((acc, tipo) => {
          acc[tipo] = (acc[tipo] || 0) + 1; // Incrementa il contatore
          return acc;
        }, {} as Record<string, number>);

        // Assicurati che ogni tipo di carburante abbia un conteggio
        const carburanteData = Object.entries(carburanteCount).map(([tipo, count]) => ({
          tipo: tipo,
          count: count
        }));

        // Estrai i dati per il grafico
        const carburanteLabels = carburanteData.map(item => item.tipo);
        const carburanteCounts = carburanteData.map(item => item.count);

        // Crea il grafico a barre
        new Chart('barChartCarburante', {
          type: 'bar',
          data: {
            labels: carburanteLabels,
            datasets: [
              {
                label: 'Distribuzione Carburante',
                data: carburanteCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      error: (error) => {
        console.error('Errore nel caricamento dei dati del carburante:', error);
      }
    });
  }
  loadCategoriaPercentageChart(): void {
    this.service.getCategoriaFromSavedSearches().subscribe({
      next: (categoria: string[]) => {
        // Conta le occorrenze di ciascuna categoria
        const categoriaCount = categoria.reduce((acc, tipo) => {
          acc[tipo] = (acc[tipo] || 0) + 1; // Incrementa il contatore
          return acc;
        }, {} as Record<string, number>);

        // Assicurati che ogni categoria abbia un conteggio
        const categoriaData = Object.entries(categoriaCount).map(([tipo, count]) => ({
          tipo: tipo,
          count: count
        }));

        // Estrai i dati per il grafico
        const categoriaLabels = categoriaData.map(item => item.tipo);
        const categoriaCounts = categoriaData.map(item => item.count);

        // Crea il grafico a barre
        new Chart('barChartCategoria', {
          type: 'bar',
          data: {
            labels: categoriaLabels,
            datasets: [
              {
                label: 'Distribuzione Categoria',
                data: categoriaCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Frequenza di ricerca' },
                ticks: {
                  stepSize: 1,
                  callback: value => (Number.isInteger(value) ? value : null),
                },
              }
            }
          }
        });
      },
      error: (error) => {
        console.error('Errore nel caricamento dei dati delle categorie:', error);
      }
    });
  }


}
