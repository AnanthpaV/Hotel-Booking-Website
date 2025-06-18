import React from "react";
export default function PlaceImg({place},index=0,className=null){
    if(!place.photos?.length){
        return <p>No photos available</p>;
    }
    if(!className){
        className = "places-list";
    }
    return(
        <div className={className}>
        <img src={place.photos[0]} alt="Place" />
        </div>
    );
}