/* TODO: correct reports mock */

import { FunnelStepsChartTypeTypeEnum, TimeUnit } from '@/api'

export const reports = [
    {
        "id": "33",
        "name": "Bug/Feature3 - Report from Example",
        "type": "eventSegmentation",
        "query": {
            "time": {
                "type": "last",
                "last": 30,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "line",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "countPerGroup",
                            "aggregate": "median"
                        },
                        {
                            "type": "formula",
                            "formula": "124+123-33*(2/2)=x"
                        },
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "11",
                            "aggregate": "percentile75",
                            "aggregatePerGroup": "median"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "2",
                            "aggregate": "sum"
                        }
                    ],
                    "breakdowns": [],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ],
            "filters": {
                "groupsCondition": "or",
                "groups": [
                    {
                        "filtersCondition": "and",
                        "filters": [
                            {
                                "type": "property",
                                "cohortId": 0,
                                "groupId": 0,
                                "propertyType": "event",
                                "operation": "eq",
                                "value": [
                                    "Lamp"
                                ],
                                "propertyId": "2"
                            }
                        ]
                    },
                    {
                        "filtersCondition": "and",
                        "filters": []
                    }
                ]
            },
            "breakdowns": [
                {
                    "type": "property",
                    "propertyType": "event",
                    "propertyId": "5",
                    "propertyName": "product_length"
                }
            ],
            "segments": [
                {
                    "name": "Segment 1",
                    "conditions": [
                        {
                            "type": "hasPropertyValue",
                            "propertyName": "Age",
                            "operation": "eq"
                        },
                        {
                            "type": "hadPropertyValue",
                            "propertyName": "element",
                            "operation": "lte",
                            "time": {
                                "type": "between",
                                "from": "2022-09-22",
                                "to": "2022-09-28"
                            }
                        }
                    ]
                },
                {
                    "name": "Segment Test",
                    "conditions": [
                        {
                            "type": "didEvent",
                            "eventName": "sign_up",
                            "eventId": "1",
                            "eventType": "regular",
                            "filters": [
                                {
                                    "type": "property",
                                    "propertyName": "product_category",
                                    "propertyType": "event",
                                    "propertyId": "3",
                                    "operation": "eq",
                                    "value": [
                                        "Tables",
                                        "Doors"
                                    ]
                                }
                            ],
                            "aggregate": {
                                "type": "count",
                                "value": 1,
                                "operation": "gte",
                                "time": {
                                    "type": "windowEach",
                                    "unit": "day"
                                }
                            }
                        },
                        {
                            "type": "didEvent",
                            "eventName": "Find Product",
                            "eventId": 2,
                            "eventType": "custom",
                            "filters": [],
                            "aggregate": {
                                "type": "count",
                                "value": null,
                                "operation": "lt",
                                "time": {
                                    "type": "windowEach",
                                    "unit": "minute"
                                }
                            }
                        }
                    ]
                }
            ],
            "steps": [],
            "holdingConstants": [],
            "exclude": []
        }
    },
    {
        "id": 31,
        "name": "New Report for Test",
        "type": "eventSegmentation",
        "query": {
            "type": "eventSegmentation",
            "time": {
                "type": "last",
                "n": 20,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "line",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "countPerGroup",
                            "aggregate": "median"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": [
                        {
                            "type": "property",
                            "propertyName": "product_name",
                            "propertyId": "2",
                            "propertyType": "event",
                            "operation": "eq",
                            "value": [
                                "Doors",
                                "Tables"
                            ]
                        },
                        {
                            "type": "property",
                            "propertyName": "custom prop 1",
                            "propertyId": "1",
                            "propertyType": "custom",
                            "operation": "neq",
                            "value": [
                                "Shelves"
                            ]
                        }
                    ]
                },
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "formula",
                            "formula": "2+57*255"
                        },
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "7",
                            "aggregate": "75thPercentile",
                            "aggregatePerGroup": "distinctCount"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "6",
                            "aggregate": "min"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ],
            "filters": {
                "groupsCondition": "or",
                "groups": [
                    {
                        "filtersCondition": "and",
                        "filters": [
                            {
                                "type": "property",
                                "propertyType": "event",
                                "operation": "eq",
                                "value": [
                                    "Lamp"
                                ],
                                "propertyId": "2"
                            }
                        ]
                    },
                    {
                        "filtersCondition": "and",
                        "filters": []
                    }
                ]
            },
            "breakdowns": [
                {
                    "type": "property",
                    "propertyType": "event",
                    "propertyId": "5"
                }
            ],
            "segments": [
                {
                    "name": "Segment 1",
                    "conditions": [
                        {
                            "type": "hasPropertyValue",
                            "propertyName": "product_name",
                            "operation": "eq",
                            "values": [
                                "Lamp",
                                "Tables"
                            ]
                        },
                        {
                            "type": "hadPropertyValue",
                            "propertyName": "product_price",
                            "operation": "lte",
                            "values": [
                                "Shelves"
                            ],
                            "time": {
                                "type": "between",
                                "from": "2022-09-22",
                                "to": "2022-09-28"
                            }
                        }
                    ]
                },
                {
                    "name": "Segment Test",
                    "conditions": [
                        {
                            "type": "didEvent",
                            "eventName": "sign_up",
                            "eventId": "1",
                            "filters": [
                                {
                                    "type": "property",
                                    "propertyName": "product_category",
                                    "propertyType": "event",
                                    "propertyId": "3",
                                    "operation": "eq",
                                    "value": [
                                        "Tables",
                                        "Doors"
                                    ]
                                }
                            ],
                            "aggregate": {
                                "type": "didEventCount",
                                "value": 1,
                                "operation": "gte",
                                "time": {
                                    "type": "windowEach",
                                    "unit": "day"
                                }
                            }
                        },
                        {
                            "type": "didEvent",
                            "eventName": "Find Product",
                            "eventId": "2",
                            "eventType": "custom",
                            "filters": [],
                            "aggregate": {
                                "type": "didEventRelativeCount",
                                "operation": "lt",
                                "time": {
                                    "type": "windowEach",
                                    "unit": "minute"
                                },
                                "rightEvent": {
                                    "eventId": "1",
                                    "eventName": "sign_up",
                                    "eventType": "regular"
                                }
                            }
                        }
                    ]
                }
            ],
            "steps": [
                {
                    "events": [
                        {
                            "eventType": "custom",
                            "eventId": 1,
                            "eventName": "Create Product",
                            "filters": [
                                {
                                    "propertyName": "productName",
                                    "propertyId": "5",
                                    "propertyType": "event",
                                    "type": "property",
                                    "operation": "regex",
                                    "value": [
                                        "Tables",
                                        "Lamp"
                                    ]
                                }
                            ]
                        }
                    ],
                    "order": "any"
                }
            ],
            "exclude": [
                {
                    "eventType": "regular",
                    "eventName": "Sign Up",
                    "filters": [
                        {
                            "propertyType": "event",
                            "type": "property",
                            "operation": "neq",
                            "value": [
                                "Tables",
                                "Doors"
                            ]
                        }
                    ]
                }
            ],
            "holdingConstants": [
                {
                    "propertyType": "event",
                    "propertyId": "5",
                    "propertyName": "productName"
                },
                {
                    "propertyType": "event",
                    "propertyId": "1",
                    "propertyName": "query"
                }
            ]
        }
    },
    {
        "id": 1,
        "name": "Report for Dashboard",
        "type": "eventSegmentation",
        "query": {
            "type": "eventSegmentation",
            "time": {
                "type": "last",
                "n": 20,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "column",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "formula",
                            "formula": ""
                        },
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "7",
                            "aggregate": "75thPercentile",
                            "aggregatePerGroup": "distinctCount"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "6",
                            "aggregate": "min"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ]
        }
    },
    {
        "id": 2,
        "name": "Report 2",
        "type": "eventSegmentation",
        "query": {
            "type": "eventSegmentation",
            "time": {
                "type": "last",
                "n": 20,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "line",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "formula",
                            "formula": "+2"
                        },
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "7",
                            "aggregate": "75thPercentile",
                            "aggregatePerGroup": "distinctCount"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "6",
                            "aggregate": "min"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ]
        }
    },
    {
        "id": 3,
        "name": "Report 3",
        "type": "eventSegmentation",
        "query": {
            "type": "eventSegmentation",
            "time": {
                "type": "last",
                "n": 20,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "column",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "formula",
                            "formula": "-124"
                        },
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "7",
                            "aggregate": "75thPercentile",
                            "aggregatePerGroup": "distinctCount"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "6",
                            "aggregate": "min"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ]
        }
    },
    {
        "id": 4,
        "name": "Report 4",
        "type": "eventSegmentation",
        "query": {
            "type": "eventSegmentation",
            "time": {
                "type": "last",
                "n": 20,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": "pie",
            "analysis": {
                "type": "linear"
            },
            "events": [
                {
                    "eventName": "sign_up",
                    "queries": [
                        {
                            "type": "aggregatePropertyPerGroup",
                            "propertyType": "event",
                            "propertyId": "7",
                            "aggregate": "75thPercentile",
                            "aggregatePerGroup": "distinctCount"
                        },
                        {
                            "type": "formula",
                            "formula": "x * y"
                        },
                        {
                            "type": "aggregateProperty",
                            "propertyType": "event",
                            "propertyId": "6",
                            "aggregate": "min"
                        }
                    ],
                    "eventType": "regular",
                    "eventId": "1",
                    "filters": []
                }
            ]
        }
    },
    {
        "id": 8747,
        "name": "Funnels Report #1",
        "type": "funnel",
        "query": {
            "type": "funnel",
            "time": {
                "type": "last",
                "n": 30,
                "unit": "day"
            },
            "group": "user",
            "intervalUnit": "day",
            "chartType": {
                "type": FunnelStepsChartTypeTypeEnum.Steps,
                "intervalUnit": TimeUnit.Day,
            },
            "analysis": {
                "type": "linear"
            },
            "events": [],
            "filters": {
                "groupsCondition": "and",
                "groups": [
                    {
                        "filtersCondition": "and",
                        "filters": []
                    }
                ]
            },
            "breakdowns": [],
            "segments": [
                {
                    "name": "Segment 1",
                    "conditions": []
                },
                {
                    "name": "Segment 2",
                    "conditions": []
                }
            ],
            "steps": [
                {
                    "events": [
                        {
                            "eventType": "custom",
                            "eventId": 2,
                            "eventName": "Find Product",
                            "filters": []
                        }
                    ],
                    "order": "any"
                },
                {
                    "events": [
                        {
                            "eventType": "regular",
                            "eventId": "1",
                            "eventName": "Sign Up",
                            "filters": [
                                {
                                    "propertyName": "productName",
                                    "propertyId": "5",
                                    "propertyType": "event",
                                    "type": "property",
                                    "operation": "eq",
                                    "value": [
                                        "Lamp",
                                        "Doors"
                                    ]
                                }
                            ]
                        },
                        {
                            "eventType": "regular",
                            "eventId": "1",
                            "eventName": "Sign Up",
                            "filters": []
                        }
                    ],
                    "order": "any"
                }
            ],
            "holdingConstants": [
                {
                    "propertyType": "event",
                    "propertyId": "3",
                    "propertyName": "product_category"
                }
            ],
            "exclude": []
        }
    }
]
