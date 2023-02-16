import AppLayout from "@lib/components/Layouts/AppLayout";
import { useSession } from "next-auth/react";
import { getSession } from "@lib/auth/session";

import { useState, useRef, useEffect, useCallback } from "react";
import { FolderIcon } from "@heroicons/react/outline";
import { read, readFile, utils, writeFile } from 'xlsx';

import { TrashIcon} from "@heroicons/react/solid";
import { useRouter } from 'next/router'
import { compareAsc, format } from 'date-fns'
import { add } from "lodash";
import Loader from "@lib/components/Loader";

import PDFGenerator from "@lib/utils/PDFGenerator"

import { GoogleMap, useJsApiLoader, useLoadScript, useGoogleMap } from '@react-google-maps/api';

import { Hint } from 'react-autocomplete-hint';

import usePlacesAutocomplete, { getGeocode , getLatLng } from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


const PlacesAutoComplete = ({childToParentAddress, childToParentLatLng}) => {

    const [latLng, setLatLng] = useState({});

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
      })

    useEffect(() => {
        childToParentAddress(value)
    }, [value]);

    useEffect(() => {
        childToParentLatLng(latLng)
    }, [latLng])

    const handleInput = (e) => {
        setValue(e.target.value);
    };
    
    const handleSelect = (val) => {
        setValue(val, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({ address: val }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            setLatLng({ lat, lng });
            // console.log("📍 Coordinates: ", latLng);
        });
    };

   
    return (
        <Combobox onSelect={handleSelect} aria-labelledby="demo" >
          <p className="font-bold mb-1">Customer Address: </p>
          <ComboboxInput value={value} placeholder="Client Address" onChange={handleInput} disabled={!ready} className="p-1 rounded-lg drop-shadow-lg block bg-white w-full border border-slate-300 ring-black focus:outline-none focus:border-sky-500 focus:ring-black focus:ring-1 shadow-sm text-center" required/>
          <ComboboxPopover portal={false}>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
    );
}

const Page = () => {
    const [files, setFiles] = useState([])
    // const [errors, setErrors] = useState([])
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [items, setItems] = useState({})
    const [quoteLoading, setQuoteLoading] = useState(false)
    const [logo, setLogo] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [reference, setReference] = useState({})
    const [data, setData] = useState({})
    const [filteredData,setFilteredData] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalHours, setTotalHours] = useState(0)
    const [ libraries ] = useState(['places']);
    const [date, setDate] = useState(format(new Date(), 'PPP'))
    const [selected, setSelected] = useState(null)
    const { status, data: session } = useSession({required: false});

    // suggestions
    const [productCodeSuggestions, setProductCodeSuggestions] = useState([])
    const [productNameSuggestions, setProductNameSuggestions] = useState([])


    // form states
    const [clientName, setClientName] = useState('')
    const [clientAddress, setClientAddress] = useState('')
    const [clientLatLng, setClientLatLng] = useState({})
    const [clientEmail, setClientEmail] = useState('')
    const [PONumber, setPONumber] = useState('')
    const [salesContact, setSalesContact] = useState('')
    const [slsID, setSlsID] = useState('')
    const [calibrationType, setCalibrationType] = useState('')
    const [quotationDueDate, setQuotationDueDate] = useState(format(new Date(), 'PPP'))



    const file = "reference/toolist.xlsx"
    const ref = useRef(null)
    const router = useRouter()
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const getReference = async () => {
        const res = await fetch(file)
        const data = await res.arrayBuffer()
        const wb = read(data, {type: 'buffer'})
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const dataParse = utils.sheet_to_json(ws)
        setReference(dataParse)

        // filter product code suggestions and push to state
        const productCodes = dataParse.map(item => item["Product Code"])
        const filteredProductCodes = productCodes.filter(item => item !== undefined)
        setProductCodeSuggestions(filteredProductCodes)


        // filter product name suggestions and push to state
        const productNames = dataParse.map(item => item["Product Name"]?.trim())
        const filteredProductNames = productNames.filter(item => item !== undefined)
        setProductNameSuggestions(filteredProductNames)
    }

    useEffect(() => {
        getReference()
    }, [file])

    useEffect(() => {
        
        if(data?.length){
            findAvailability(data)
            
        }

        
        setItems(data)

        setQuoteLoading(false)
        
    }, [data])

    useEffect(() => {
        let fileReader, isCancel = false;
        if (logo) {
          fileReader = new FileReader();
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result && !isCancel) {
              setFileDataURL(result)
            }
          }
          fileReader.readAsDataURL(logo);
        }
        return () => {
          isCancel = true;
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
        }
    
    }, [logo]);

    useEffect(() => {
        if(items.length > 0){
            removeDuplicateItems(items)
            calculateHoursPrices(items)
        }
        
    }, [items])

    useEffect(() => {
        if(filteredData?.length > 0){
            addPrices()
            addHours()
        }
    }, [filteredData])
    
    
    useEffect(() => {
        if(data.length && fromDate && toDate){
            const from = new Date(fromDate)
            const to = new Date(toDate)

            
            
            const newData = data?.filter((item) => {
                console.log(new Date(item['Due Date']))
                const date = new Date(item['Due Date'])
                return date >= from && date <= to
            })

            setItems(newData)
        }
    }, [toDate, fromDate])

    

    const childToParentAddress = (childAddress) => {
        setClientAddress(childAddress)
    }

    const childToParentLatLng = (childLatLng) => {
        setClientLatLng(childLatLng)
    }

   

    const removeDuplicateItems = (items) => {
        
        // find every code
        const unique = [...new Set(items.map(item => item['Calibration Product Code']))]

        // if found code is in unique array, return it
        const newData = unique.map(code => {
            
            const count = items.filter(item => {
                if (item['Calibration Product Code'] === code) {
                  return true;
                }
              
                return false;
            }).length;

            // add count to item quantity
            items.find(item => item['Calibration Product Code'] === code).Quantity = count

            

            return items.find(item => item['Calibration Product Code'] === code)
        })
        
        setFilteredData(newData)
       
    }

    
    const findAvailability = (items) => {
        if(data.length){
            items?.map(item => {
                
                const found = reference?.find((lookup) => 
                
                    lookup['Product Code']?.toString().trim() === formatCode(item["Calibration Product Code"])?.trim()
                )
                
                if (found) {
                    item.Availability = found['Standard Location']
                } else {
                    item.Availability = '-'
                }
            })
        }

    }


    const addPrices = () => {
        const prices = filteredData?.reduce((acc, item) => {
            
            return acc + (parseFloat(item.Price * item.Quantity))
        }, 0)

        setTotalPrice(prices)

    }

    const addHours = () => {
        const hours = filteredData?.reduce((acc, item) => {
            
            return acc + (parseFloat(item.Hours * item.Quantity ))
        }, 0)

        setTotalHours(Math.ceil(hours))
    }

    // change the value of quantity in filteredData

    const handleQuantityChange = (quantity, id) => {
        const newData = filteredData?.map(item => {
            if(item['Asset #'] === id){
                item.Quantity = quantity
            }
            return item
        })

        setFilteredData(newData)
    }

    const handlePriceChange = (price, id) => {
        const newData = filteredData?.map(item => {
            if(item['Asset #'] === id){
                item.Price = price
            }
            return item
        })

        setFilteredData(newData)
    }

    const handleHoursChange = (hours, id) => {
        const newData = filteredData?.map(item => {
            if(item['Asset #'] === id){
                item.Hours = hours
            }
            return item
        })

        setFilteredData(newData)
    }


    // const handleQuantityChange = (quantity, id) => {
    //     // const newData = filteredData?.map(item => {
    //     //     if(item['Asset #'] === id){
    //     //         item.Quantity = quantity
    //     //     }
    //     // })

    //     // setItems(newData)    
    // }

    const handleImport = ($event) => {
        setQuoteLoading(true)
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result, {cellDates: true, dateNF:"mm/dd/yyyy"});
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setData(rows)
                }
            }
            setFiles(files)
            reader.readAsArrayBuffer(file);
          
        }
        
    }

    const calculateHoursPrices = (items) => {
        const hours = 0
        const price = 0
        
        items?.map(item => {
            const found = reference?.find((lookup) => 
                lookup['Product Code']?.toString().trim() === formatCode(item["Calibration Product Code"])?.trim()
            )

            if (found) {
                item.Price = found[' Current Pricing ']
                item.Hours = found['Time Needed']
            } else {            
                item.Price = 0
                item.Hours = 0
            }
            
        })


    }

    const formatCode = (text) => {
        if(text){
            if(productCodeSuggestions?.includes(text) || !text.includes('-')){
                const result = text
                return result
            } else {
                const result = /([^-]*)-/.exec(text)[1] 
                return result 
            }
        }
        return result
    }

    const removeItem = (idx) => {
        setFilteredData((current) => current.filter((item, index) => index !== idx))
    }

    const handleAmount = (amount, asset_no) => {
       
        setFilteredData((prevState) => {
            const newState = prevState?.map((item, index) => {
                if (item['Asset #'] === asset_no) {
                    item['Amount'] = amount
           
                return item
                }
                return item
           
            })
            return newState
    })
    
  }


    const addRow = () => {
        setFilteredData((prevState) => {
            if(prevState?.length){
                const newState = [...prevState, {
                    'Asset Type': '',
                    'Calibration Product Code': '',
                    'Quantity': 1,
                    'Price': 0,
                    'Availability': '-',
                    'Hours': 0
                }]
                return newState
            }else{
                return [{
                    'Asset Type': '',
                    'Calibration Product Code': '',
                    'Quantity': 1,
                    'Price': 0,
                    'Availability': '-',
                    'Hours': 0
                }]
            }
            
        })
    }

    // const handleLogo = (e) => {
    //     const logo = e.target.files[0]
    //     const reader = new FileReader()
        
    //     setLogo(logo)
    //     // reader.readAsDataURL(file)
    //     // reader.onloadend = () => {
    //     //     setLogo(reader.result)
    //     // }
    // }

    const search = (e) => {
        const keyword = e.target.value

        if(filteredData.length){
            const newData = data?.filter((item) => {
                return item['Asset Type'].toString().includes(keyword) || item['Calibration Product Code'].toString().includes(keyword)
            })
    
            setFilteredData()
        }
       
        
    }

    const handleQuote = async() => {
        const result = await fetch('/api/create-quotation/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'pending',
                formData: {clientName, clientAddress, clientLatLng, clientEmail, PONumber, salesContact, slsID, calibrationType, totalHours, totalPrice}
            }),
        })

        const data = await result.json()

        const formData = {clientName, clientAddress, clientEmail, PONumber, salesContact, slsID, calibrationType, totalHours, totalPrice, quotationDueDate}

        if(data && filteredData){
            PDFGenerator(filteredData, formData)
        }
       
        router.push('/jobs')
        
    }

    

    const handleQuotationSubmission = (e) => {
        setQuoteLoading(true)
        e.preventDefault()
        handleQuote()
        setQuoteLoading(false)
    }

    const handleProductCodeChange = (code, id) => {
        // console.log("product code change", code, id)
        const newData = filteredData?.map(item => {

            const index = filteredData.indexOf(item)


            if(index === id){
                item['Calibration Product Code'] = code
            }
            return item
        })

       
        setFilteredData(newData)

        calculateHoursPrices(filteredData)
    }

    const handleAssetTypeChange = (type, id) => {

        
        const newData = filteredData?.map(item => {
            // find index of item
            const index = filteredData.indexOf(item)

           

            if(index === id){
                item['Asset Type'] = type
            }

            return item
        })

        setFilteredData(newData)
    }

   

    // console.log(reference.find(lookup => lookup['Product Code'] === 'CAL TCAL-P'))
    //console.log(filteredData)
   
    return (
    <>
      
      <AppLayout>
      <>
        <form onSubmit={handleQuotationSubmission}>
        <div className="flex w-full flex-col ">
           <div className="flex justify-center flex-row p-20">
                <div className="flex justify-center text-center w-full ">
                    <label htmlFor="fileInput" className="drop-shadow-lg flex flex-col justify-center items-center w-full h-64  rounded-lg border-2 border-blue-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                       {!files.length ? <div className="flex flex-col justify-center items-center">
                            {/* <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg> */}
                            <p className="mb-2 text-gray-900 dark:text-gray-400 text-base font-bold"><span className="font-semibold ">Click to upload and generate quote from .xlsx file</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 5MB)</p>
                        </div>:
                        <>
                            <FolderIcon className="h-5 w-5"/>
                            <p className="mb-2 text-lg font-bold text-blue-400 dark:text-gray-400">{files[0].name}</p>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload a different file</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.XLSX (MAX. 5MB)</p>
                        </>
                        }
                        <input id="fileInput" type="file" className="hidden absolute" onChange={handleImport} accept=".xls,.xlsx"/>
                    </label>
                </div> 
                                
                        {/* <div className="">
                            <button onClick={handleExport} className="">
                                Export <i className="fa fa-download"></i>
                            </button>
                        </div> */}
 
            </div>

            {quoteLoading === false ? 
            
            <div id="full quote">
            <div className="mt-10">
                <div className="mt-14 mb-14">
                    
                    <div className=" flex flex-wrap space-y-6 justify-center md:justify-between min-w-full mb-10 ">
                        
                        {!fileDataURL ? 
                        <div className="flex flex-wrap flex-col">
                            <div className="rounded-lg p-20 mt-4 hover:cursor-pointer border-dashed border-2 border-gray-300 hover:bg-gray-100" onClick={() => ref.current?.click()}>
                                <p className="font-bold text-center">Company Logo</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center"><span className="font-semibold">Click to upload</span></p>
                            </div>
                            
                            <input  type="file"
                                    id="filePicker"
                                    onChange={(e) => handleLogo(e)}
                                    ref={ref}
                                    accept="image/*"
                                    className="hidden"
                            /> 
                            
                            <div className="p-10 hover:cursor-pointer text-center bg-gray-100 rounded-lg mt-6">
                                <p className="font-bold">Quotation Due On:</p>
                                <div className="mt-2">
                                    <input className="rounded-lg drop-shadow-lg" type="date" value={quotationDueDate} onChange={(e) => setQuotationDueDate(e.target.value)} required></input>
                                </div>
                            </div>     
                                                
                            
                        </div> :

                        <div className="flex flex-wrap flex-col">

                            <div className="mt-10 " >
                            {   
                                <div onClick={() => ref.current?.click()}>
                                    <img src={fileDataURL} alt="preview" className="w-50 h-50" />
                                    <input  type="file"
                                        id="filePicker"
                                        onChange={(e) => handleLogo(e)}
                                        ref={ref}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            }
                            </div>
                            <div className="p-10 hover:cursor-pointer text-center bg-gray-100 rounded-lg mt-6">
                                <p className="font-bold">Quotation Due On:</p>
                                <div className="mt-2">
                                    <input className="rounded-lg drop-shadow-lg" type="date" value={quotationDueDate} onChange={(e) => setQuotationDueDate(e.target.value)} required></input>
                                </div>
                            </div> 
                        </div>

                        }
                        <div>
                        <div className="p-20 hover:cursor-pointer text-center bg-gray-100 rounded-lg">
                            <p className="font-bold">Quote Prepared for:</p>
                            <div className="mt-2">
                                <input className="rounded-lg drop-shadow-lg placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-black focus:ring-1 sm:text-sm text-center" placeholder="Client Name" type="text" name="search" onChange={(e) => setClientName(e.target.value)} required/>
                            </div>
                            <div className="mt-2">
                                {isLoaded ? <PlacesAutoComplete childToParentAddress={childToParentAddress} childToParentLatLng={childToParentLatLng} /> : null} 
                            </div>
                            <p className="font-bold mt-2">Client Email:</p>
                            <div className="mt-2">
                                <input className="rounded-lg drop-shadow-lg placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-black focus:ring-1 sm:text-sm text-center" placeholder="Client Email" type="email" name="email" onChange={(e) => setClientEmail(e.target.value)} required/>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="pb-14 overflow-x-auto scrollbar-hide">
                        <table className="min-w-full text-sm">
                            <thead className="rounded-lg">
                                <tr className="rounded-lg">
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO NUMBER</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALES CONTACT</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLS ID</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CALIBRATION TYPE</th>
                                    
                                </tr>
                            </thead>
                            <tbody className="pt-10">
                                <tr className="m-2">
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="PO NUMBER..." type="text" name="po number" onChange={(e) => setPONumber(e.target.value)} required/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="SALES CONTACT..." type="text" name="sales contact" onChange={(e) => setSalesContact(e.target.value)} required/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="SLS ID..." type="text" name="sls id" onChange={(e) => setSlsID(e.target.value)} required/>
                                    </td>
                                    <td className="px-6 py-3">
                                        <input className="placeholder:italic placeholder:text-slate-400 placeholder:text-xs block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" placeholder="CALIBRATION TYPE..." type="text" name="calibration type" onChange={(e) => setCalibrationType(e.target.value)} required/>
                                    </td>

                                </tr>
                            </tbody>
                        </table> 
                    </div>
                    {/* <div className="font-semibold italic mt-10">*A purchase order or credit card must be provided prior to service work commencing.</div> */}

                    <form>
                    <div className="flex flex-wrap space-y-3 justify-center text-center md:justify-between min-w-full mt-10">
                        
                        <div>
                            <span className="mb-5 font-bold">Filter By Item Name/Item Code:</span>
                            <div className="mt-2">
                                <input
                                    className="rounded-lg drop-shadow-lg placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center"
                                    placeholder="Search by phrase...."
                                    type="text"
                                    name="search"
                                    onChange={(e) => search(e)}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-bold">Dates Between:</span>
                            
                            <div className="mt-2"><input className="rounded-lg drop-shadow-lg" type="date" onChange={(e) => setFromDate(e.target.value)}></input></div>
                            <div className="mt-2"><input className="rounded-lg drop-shadow-lg" type="date" onChange={(e) => setToDate(e.target.value)}></input></div>
                            {/* <div date-rangepicker className="flex items-center mt-5">
                                <div className="relative w-full">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <input name="start" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Start Date"/>
                                </div>
                                <span className="mx-4 text-gray-500">to</span>
                                <div className="relative w-full">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                                    </div>
                                    <input name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="End Date"/>
                                </div>
                            </div> */}
                        </div>
                        
                    </div>
                    </form>
                    {/* Quote Table */}


                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="min-w-full mt-10">
                            <thead className="rounded-lg mb-4">
                                <tr className="rounded-lg">
                                    {/* <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:block min-w-max">Id</th> */}
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price($)</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Needed(Hrs)</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="mt-5"> 
                                    {
                                        filteredData?.length
                                        ?
                                        filteredData?.map((item, index) => (
                                            <tr key={index} className="pt-10">
                                                {/* <th scope="row" className="hidden md:block">{ index + 1 }</th> */}
                                                <td className="px-6 py-2">
                                                    {/* <Hint options={productNameSuggestions} allowTabFill>
                                                        <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full min-w-max  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item["Asset Type"]} placeholder={ item["Asset Type"]} type="text" onChange={(e) => handleAssetTypeChange(e.target.value, index)} required/>
                                                    </Hint> */}
                                                    {productNameSuggestions && <Autocomplete
                                                        disablePortal
                                                        id="product-name"
                                                        options={productNameSuggestions}
                                                        value={item["Asset Type"]}
                                                        inputValue={item["Asset Type"]}
                                                        onChange={(e, newValue) => handleAssetTypeChange(newValue, index)}
                                                        onInputChange={(e, newInputValue) => handleAssetTypeChange(newInputValue, index)}
                                                        sx={{ width: 200 }}
                                                        renderInput={(params) => <TextField {...params} label="Product Name" />}
                                                    />}
                                                    {/* { item["Asset Type"]} */}

                                                </td>
                                                <td className="px-6 py-2">
                                                    {/* <Hint options={productCodeSuggestions} allowTabFill>
                                                        <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full min-w-max  shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={formatCode(item["Calibration Product Code"])} placeholder={formatCode(item["Calibration Product Code"])} type="text" onChange={(e) => handleProductCodeChange(e.target.value, index)} required/>
                                                    </Hint> */}
                                                    {productCodeSuggestions && <Autocomplete
                                                        disablePortal
                                                        id="product-code"
                                                        options={productCodeSuggestions}
                                                        value={formatCode(item["Calibration Product Code"])}
                                                        inputValue={formatCode(item["Calibration Product Code"])}
                                                        onInputChange={(event, newInputValue) => handleProductCodeChange(newInputValue, index)}
                                                        onChange={(event, newValue) => handleProductCodeChange(newValue, index)}
                                                        sx={{ width: 200 }}
                                                        renderInput={(params) => <TextField {...params} label="Product Code" />}
                                                    />}
                                                    {/* { formatCode(item["Calibration Product Code"])} */}
                                                </td>
                                                <td className="px-6 py-2">
                                                    
                                                        <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item.Quantity || '0'} placeholder={item.Quantity} type="number" onChange={(e) => handleQuantityChange(e.target.value, item['Asset #'])} required/>
                                                    
                                                    {/* { item.Director } */}
                                                </td>
                                                <td className="px-6 py-2">
                                                    
                                                        <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item.Price || '0'} placeholder={item.Price || '0'} type="number" onChange={(e) => handlePriceChange(e.target.value, item['Asset #'])} required/>
                                                  
                                                    
                                                    {/* { item.Director } */}
                                                </td>
                                                <td className="px-6 py-2">
                                                    
                                                        <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item.Hours || '0'} placeholder={item.Hours || '0'} type="number" onChange={(e) => handleHoursChange(e.target.value, item['Asset #'])} required/>
                                                  
                                                    
                                                    {/* { item.Director } */}
                                                </td>
                                                <td className="px-6 py-2">
                                                    <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item.Availability || '-'} placeholder={item.Availability || '-'} type="text" required/>
                                                    {/* <span className="badge bg-warning text-dark">-</span> */}
                                                </td>
                                                <td className="px-6 py-2">
                                                <input className="placeholder:italic placeholder:text-slate-800 block bg-white w-full border border-slate-300 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-center" value={item.Quantity * item.Price * item.Hours || '0'} type="text" readOnly required/>
                                                </td>
                                                <td><TrashIcon className="h-5 w-5 hover:bg-red-400 hover:cursor-pointer" onClick={() => removeItem(index)}/></td>
                                            </tr> 
                                        ))
                                        :
                                        <tr className="">
                                            <td colSpan="8" className="text-center text-xs pt-10">No Items Found. 
                                                <span className="italic text-xs">
                                                    {' '}(use the button below to add items)
                                                </span>
                                            </td>
                                        </tr> 
                                    }
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-wrap justify-center text-center">
                        
                        <div className="m-5 text-lg font-extrabold hover:cursor-pointer bg-black text-white p-2 rounded text-center" onClick={() => addRow()}>Add New Item/Row</div>
                        

                    </div>
                </div>
                
            </div>
            </div>
            : 
                <div className="min-h-screen flex justify-center items-center">
                    <Loader/>
                </div>
            }
            <div className="bg-gray-100 p-20 rounded-lg drop-shadow-lg">
                <div className="flex flex-wrap justify-end min-w-full font-bold">
                    <div className="flex flex-row ">Estimated hours on Site:</div>
                    <input className="placeholder:italic ml-4 text-center rounded-lg mr-1" placeholder="" value={totalHours || 0} readOnly></input>
                    <p className="ml-1">hrs</p>
                </div>
                <div className="flex flex-row flex-wrap justify-end min-w-full font-bold mt-5">
                    <div className="flex flex-col ">Estimated Total Price: </div>
                    <input className="placeholder:italic ml-4 text-center rounded-lg mr-1" placeholder=""  value={totalPrice || 0} readOnly></input>
                    <p>$</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-start min-w-full font-bold mt-5">
                <div>Date: </div>
                <input className="placeholder:italic ml-4" value={date}></input>
            </div>
            
        </div>
        
        {filteredData?.length ? <div className="min-w-full">
            <div className="flex flex-wrap justify-end min-w-full">
                <button
                  type="submit"
                  className="m-5 text-lg font-extrabold hover:cursor-pointer bg-red-600 text-white p-2 rounded"
                  
                  >Add to Jobs/Create PDF</button>
            </div>
        </div> : null}
        </form>
        </>
      </AppLayout>
      
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Page;
