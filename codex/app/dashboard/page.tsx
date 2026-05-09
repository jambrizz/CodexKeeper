import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home',
};
export default function Page() {
    const contractsData = () => {
        //Create a function to pull contracts and see the details of the contract
        // async & fetch
    }

    const reportedDSS = () => {
        // Create a function to show the cases that have been reported to DSS
        // async & fetch
    }

    const unreportedDSS = () => {
        // create a function to show all the DSS cases that have not been marked as reported
        // async & fetch
    }

    const cases = () => {
        // create a function to show the cases that are complete, pending signature, pending data entry
        // async & fetch
    }

    const averageProcessing = () => {
        // create a function to show the average data entry times for each process
        // async & fetch
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold text-gray-700" >Welcome to CodexKeeper</h1>
            </div>
            <div>

            </div>
        </>
    );
        
}