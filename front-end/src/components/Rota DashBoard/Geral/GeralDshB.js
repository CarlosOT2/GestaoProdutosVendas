//# Componentes //
import TxtPadrão from '../../Componentes Globais/Miscellaneous/TxtPadrão'
import IconComponent from '../../Componentes Globais/Miscellaneous/IconComponent';
import GeralForm from './GeralForm';
//# Libs //
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts';
import qs from 'qs'
import { PerformRequest } from 'performrequest'
//# Icons //
import { BsFilter } from 'react-icons/bs';
import { BsCalendar } from 'react-icons/bs';
//# Classes //
import './GeralDshB.scss'
//# Helpers //
import Numeral from '../../../helpers/js/Numeral';
//# Config //
import WebService from '../../../config/config_websv'
/*--------------*/

//# Exportações //

export default function GeralDashBoard() {
    //# States //
    const [data_dashboard, setDataDashBoard] = useState({})
    const [filter, setFilter] = useState({
        products: {
            filter_data: {},
            filter_inputs: {
                Data: false,
                Limite: false
            },
            filter_enabled: false
        }
    })

    //# Funções //
    //.. Handles //
    function handleButton() {
        setFilter(prevState => ({
            ...prevState,
            products: {
                ...prevState.products,
                filter_enabled: !filter.products['filter_enabled']
            }
        }))
    }
    function handleSection(filter_name) {

        setFilter(prevState => {
            const { products } = prevState
            return ({
                products: {
                    ...products,
                    filter_inputs: {
                        ...products.filter_inputs,
                        [filter_name]: !products.filter_inputs[filter_name]
                    }
                }
            })
        })
    }

    //.. Format //
    function format_res(res) {
        //-- Todos Os Objetos Da 'Res' (Array De Objetos), Tem Que Ter As Mesmas Chaves, Para Funcionar Corretamente //
        let formatted_obj;
        for (const obj_key in res) {
            const current_obj = res[obj_key]
            if (!current_obj || current_obj.length === 0) continue
            const data_keys = Object.keys(res[obj_key][0]);
            data_keys.forEach(key => {
                formatted_obj = {
                    ...formatted_obj,
                    [obj_key]: {
                        ...formatted_obj?.[obj_key],
                        [key]: current_obj.map(item => item[key])
                    }
                }
            });
        }
        return formatted_obj
    }
    function format_number(number, type) {
        const format_method = type === '$' ? '$0,0' : '0,0'
        return Numeral(number).format(format_method)
    }

    //.. Chart //
    function chart(config_chart) {
        //.. Variables //
        const { type, categories, series, config } = config_chart

        //.. Config //
        const { color, negative } = config

        //.. Charts //
        const chart_components = {
            Area: () => {
                return (
                    <Chart
                        options={{
                            chart: {
                                type: 'area',
                                height: '100%',
                                stacked: true,
                            },
                            grid: {
                                borderColor: 'var(--dashboard-options_5)',
                            },
                            colors: color,
                            xaxis: {
                                categories: categories,
                                labels: {
                                    show: false
                                },
                                axisBorder: {
                                    show: false,
                                },
                                axisTicks: {
                                    show: false,
                                },
                                tooltip: {
                                    enabled: false,
                                }
                            },
                            yaxis: [
                                {
                                    labels: {
                                        formatter: (value) => {
                                            return format_number(value, '$');
                                        },
                                        style: {
                                            colors: 'var(--txt-color-standard)',
                                        }
                                    },
                                    opposite: true,
                                    forceNiceScale: true,
                                },
                            ],
                            nd: {
                                position: 'top',
                                horizontalAlign: 'left'
                            },
                            dataLabels: {
                                enabled: true,
                                formatter: function (_, opts) {
                                    return opts.dataPointIndex + 1;
                                }
                            }
                        }}
                        series={series}
                        type='area'
                        width="100%"
                        height="100%"
                    />

                )
            },
            Column: () => {
                const label_colors = categories.map(negative ?
                    (_, index) => {
                        for (const serie_name of negative) {
                            const serie_index = series.findIndex(serie => serie.name === serie_name)
                            const serie_data = series[serie_index]?.data[index]
                            if (serie_data < 0) return 'var(--dashboard-negative)'
                        }
                        return 'var(--dashboard-categorie)'
                    }
                    :
                    () => 'var(--dashboard-categorie)'
                )


                return (
                    <Chart
                        options={{
                            colors: color,
                            chart: {
                                type: 'bar',
                            },
                            grid: {
                                borderColor: 'var(--dashboard-options_5)',
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    borderRadius: 3,
                                    columnWidth: '60%',

                                }
                            },
                            stroke: {
                                show: true,
                                width: 3,
                                colors: ['transparent']
                            },
                            xaxis: {
                                categories: categories,
                                axisBorder: {
                                    color: 'var(--dashboard-options_5)'
                                },
                                axisTicks: {
                                    color: 'var(--dashboard-options_5)'
                                },
                                labels: {
                                    style: {
                                        colors: label_colors
                                    }
                                },
                            },
                            yaxis: [
                                {
                                    labels: {
                                        formatter: (value) => {
                                            return format_number(value, '$');
                                        },
                                        style: {
                                            colors: 'var(--txt-color-standard)',
                                        }
                                    },
                                    forceNiceScale: true,
                                },
                                {
                                    opposite: true,
                                    labels: {
                                        formatter: (value) => {
                                            return format_number(value);
                                        },
                                        style: {
                                            colors: 'var(--txt-color-standard)',
                                        }
                                    },
                                    forceNiceScale: true,
                                    min: 0,
                                },
                            ],
                            dataLabels: {
                                enabled: false,
                            },
                            legend: {
                                labels: {
                                    colors: 'var(--txt-color-standard)',
                                },
                                fontSize: '12px',
                            },
                        }}
                        series={series}
                        type='bar'
                        width="100%"
                        height="100%"
                    />
                )
            }
        }

        const CurrentChart = chart_components[type]
        return <CurrentChart />
    }

    //.. Miscellaneous //
    function getTotal(array_numbers, money) {
        if (array_numbers && Array.isArray(array_numbers)) {
            const total = array_numbers.reduce((acc, num) => acc + Number(num), 0)
            return money ? format_number(total, '$') : total
        }
    }

    //.. REQ, RES //
    async function req_dashboard(custom_params) {
        //.. Default Values //
        //, Limit //
        const limit_default = 10
        //, Params //
        const default_params = {
            limit: limit_default,
            lucro_maior: true,
            lucro_menor: true,
            lucro_anual: true,
            lucro_semanal: true
        }

        //.. Verify Custom //
        if (custom_params) {
            //, Default Limit //
            if (!custom_params.limit) custom_params.limit = limit_default
        }

        await PerformRequest({
            fetch: {
                url: `${WebService}/dashboard?${qs.stringify(custom_params || default_params)}`,
                method: 'GET',
            },
            message: {
                success: `status.{'status'} - Sucesso`,
                error: `status.{'status'} - {'res.info'}`
            },
            function: {
                success: (req_json) => {
                    setDataDashBoard(prevState => {
                        const formatted_data = format_res(req_json.info)
                        console.log(formatted_data)
                        return ({
                            ...prevState,
                            ...formatted_data
                        })
                    })
                }
            }
        })
    }

    //# useEffects //
    useEffect(() => {
        req_dashboard()
    }, [])



    return (
        <div className='main-div'>
            <TxtPadrão type='span' texto='Anual' title_2={true} className='main-div__title-section' />
            <section className='main-div__annual-section'>
                <div className='main-div__annual-summary'>
                    <article className='main-div__article-summary'>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={getTotal(data_dashboard.lucro_anual?.lucro, true)}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Lucro Anual'
                                className='main-div__info-label'
                            />
                        </section>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={getTotal(data_dashboard.lucro_anual?.vendas)}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Vendas Anual'
                                className='main-div__info-label'
                            />
                        </section>
                    </article>
                </div>
                <div className='main-div__annual-chart'>
                    <article className='main-div__article-chart'>
                        {
                            chart(
                                {
                                    type: 'Column',
                                    categories: data_dashboard.lucro_anual?.mes || [],
                                    series: [
                                        { name: 'Lucro Anual', data: data_dashboard.lucro_anual?.lucro },
                                        { name: 'Vendas Anual', data: data_dashboard.lucro_anual?.vendas },
                                    ],
                                    config: {
                                        color: ['var(--dashboard-options_1)', 'var(--dashboard-options_2)'],
                                        negative: ['Lucro Anual']
                                    }
                                }
                            )
                        }
                    </article>
                </div>
            </section>
            <TxtPadrão type='span' texto='Semanal' title_2={true} className='main-div__title-section' />
            <section className='main-div__weekly-section'>

                <div className='main-div__weekly-summary'>
                    <article className='main-div__article-summary'>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={getTotal(data_dashboard.lucro_semanal?.lucro, true)}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Lucro Semanal'
                                className='main-div__info-label'
                            />
                        </section>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={getTotal(data_dashboard.lucro_semanal?.vendas)}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Vendas Semanal'
                                className='main-div__info-label'
                            />
                        </section>
                    </article>
                </div>
                <div className='main-div__weekly-chart'>
                    <article className='main-div__article-chart'>
                        {
                            chart(
                                {
                                    type: 'Column',
                                    categories: data_dashboard.lucro_semanal?.dia || [],
                                    series: [
                                        { name: 'Lucro Semanal', data: data_dashboard.lucro_semanal?.lucro },
                                        { name: 'Vendas Semanal', data: data_dashboard.lucro_semanal?.vendas },
                                    ],
                                    config: {
                                        color: ['var(--dashboard-options_1)', 'var(--dashboard-options_2)'],
                                        negative: ['Lucro Semanal']
                                    }
                                }
                            )
                        }
                    </article>
                </div>
            </section>
            <TxtPadrão type='span' texto='Produtos' title_2={true} className='main-div__title-section' />
            <section className='main-div__products-section'>
                <div className='main-div__products-filter'>
                    <IconComponent
                        Icon={<BsFilter />}
                        div_classes={'main-div__filter-list-trigger'}
                        div={true}
                        title={'Adicionar Filtro'}
                        Click={handleButton}
                    />
                    <GeralForm filter={filter} req_dashboard={req_dashboard} className={'main-div__filter-inputs'} />
                    <div className='main-div__filter-list'
                        style={{
                            visibility: filter.products['filter_enabled'] ? 'visible' : 'hidden'
                        }}
                    >
                        <div className='main-div__filter-list-content'>
                            <TxtPadrão
                                texto={'O Que Você Quer Filtrar?'}
                                type={'span'}
                                className='main-div__filter-title-txt'
                                default_color={true}
                            />
                            <section className='main-div__filter-section' onClick={() => handleSection('Data')}>
                                <TxtPadrão
                                    texto={'Data'}
                                    type={'span'}
                                    pointer={true}
                                    className='main-div__filter-section-title'
                                    Txt_icon={<BsCalendar className='main-div__filter-section-icon' />}
                                />
                                <br />
                                <TxtPadrão
                                    texto={'Escolha O Intervalo Da Data, Dia, Mês, E Ano.'}
                                    pointer={true}
                                    type={'span'}
                                    className='main-div__filter-section-label'
                                />
                            </section>
                            <section className='main-div__filter-section' onClick={() => handleSection('Limite')}>
                                <TxtPadrão
                                    texto={'Limite'}
                                    type={'span'}
                                    pointer={true}
                                    className='main-div__filter-section-title'
                                    Txt_icon={<BsCalendar className='main-div__filter-section-icon' />}
                                />
                                <br />
                                <TxtPadrão
                                    texto={'Escolha O Limite De Produtos'}
                                    pointer={true}
                                    type={'span'}
                                    className='main-div__filter-section-label'
                                />
                            </section>
                        </div>
                    </div>

                </div>
                <div className='main-div__products-summary'>
                    <article className='main-div__article-summary'>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={data_dashboard.lucro_maior?.nome[0]}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Produto Maior Lucro'
                                className='main-div__info-label'
                            />
                        </section>
                        <section className='main-div__summary-section'>
                            <TxtPadrão
                                type='span'
                                texto={data_dashboard.lucro_menor?.nome[0]}
                                className='main-div__info-txt'
                                default_color={true}
                            />
                            <TxtPadrão
                                type='span'
                                texto='Produto Menor Lucro' className='main-div__info-label'
                            />
                        </section>
                    </article>
                </div>
                <div className='main-div__products-chart'>
                    <article className='main-div__article-chart--products'>
                        {
                            chart(
                                {
                                    type: 'Area',
                                    categories: data_dashboard.lucro_maior?.nome || [],
                                    series: [
                                        { name: 'Lucro', data: data_dashboard.lucro_maior?.lucro },
                                    ],
                                    config: {
                                        color: ['var(--dashboard-options_3)']
                                    }
                                }
                            )
                        }
                    </article>
                    <article className='main-div__article-chart--products'>
                        {
                            chart(
                                {
                                    type: 'Area',
                                    categories: data_dashboard.lucro_menor?.nome || [],
                                    series: [
                                        { name: 'Lucro', data: data_dashboard.lucro_menor?.lucro },
                                    ],
                                    config: {
                                        color: ['var(--dashboard-options_4)']
                                    }
                                }
                            )
                        }
                    </article>
                </div>

            </section>

        </div>
    )
}