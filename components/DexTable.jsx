// components/DexTable.js
import React from 'react';

const DexTable = ({ data }) => {

    return (
        <table className="min-w-full divide-y">
            <thead>
                <tr className="bg-black text-white">
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ">Exchange Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Total Ratings</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Average Ratings</th>
                </tr>
            </thead>
            <tbody className="bg-black divide-y">
                {data.map((row, index) => (
                    <tr key={index} className="bg-black text-white">
                        <td className="px-6 py-4 whitespace-nowrap text-white text-center">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{row.totalRatings}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= row.averageRating ? 'star-filled' : 'star-empty'}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DexTable;
