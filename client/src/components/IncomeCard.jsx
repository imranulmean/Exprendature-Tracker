import { Card, TextInput, Button, Timeline  } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function IncomeCard({item, currentUser}){

    const formatDate = (dateParam) =>{
        const formatDate= new Date(dateParam);
        const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(formatDate);
        return date;
    }
    return(
        <>
            <Card className="w-full md:w-[350px]">
                <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{item.monthName} {item.year}</h5>
                </div>
                <div className='same_height'>
                <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {
                            item.incomeList.map((e,index)=>{
                                return(
                                    <>
                                        <li className="py-3 sm:py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e.incomeName}</p>
                                                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{formatDate(e.createdAt)}</p>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{e.amount}</div>
                                            </div>
                                        </li>                                    
                                    </>
                                )
                            })
                        }                        
                    </ul>
                    Total: {item.total}
                        <div className="mb-2">
                            <div className="mb-2">
                                <p>Monthly Cash in Hand: {item.monthlyCashInHand}</p>
                                <p>Total Cash (this month):{item.totalCashInHand}</p>                                
                            </div>                            
                        </div>
                </div>
                
                <div>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-900">
                    <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Total</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{item.total}</div>
                        </div>
                    </li>                                   
                    </ul>
                    {
                        item.userId.toString()==currentUser._id &&
                        <Button color="light">
                            <Link to={`/updateIncome/${currentUser._id}/${item.monthName}/${item.year}`}>Update</Link>
                       </Button>
                    }                                          

                </div>                        
                </div>                          
            </Card>            
        </>
    )

}