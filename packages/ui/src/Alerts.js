import React from 'react';

export default function Alerts({children, type}) {
    switch(type){
        case 'success': {
            return(
                <div class="p-4 mt-4 text-success rounded-lg bg-green-50" role="alert">
                    <div class="ml-3 text-sm font-medium">
                        {children}
                    </div>
                </div>
            );
        }
        case 'error': {
            return (
                 <div class="p-4 mt-4 text-danger rounded-lg bg-red-50 " role="alert">
                    <div class="ml-3 text-sm font-medium">
                        {children}
                    </div>
                </div>
            );
        }
        case 'warn': {
            return (
                <div class="p-4 mt-4 text-warning rounded-lg bg-yellow-50" role="alert">
                    <div class="ml-3 text-sm font-medium">
                        {children}
                    </div>
                </div>
            )
        }
        case 'info': {
            return (
                 <div class="p-4 mt-4 text-info rounded-lg bg-blue-50" role="alert">
                    <div class="ml-3 text-sm font-medium">
                        {children}
                    </div>
                </div>
            )
        }
    }
}