import { async } from '@firebase/util';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import HMCard from './HMCards Card/HMCard'
import { db } from '../../../../../firebase'
import { where } from 'firebase/firestore';

const HMCards = () => {
  const [helpers,setHelpers]=useState(null)
  // const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
  // console.log("last",lastVisible)
  // const next = query(collection(db,'helpers'),orderBy("name"),startAfter(lastVisible),limit(25))
  useEffect(() => {
    const fetchData = async () => {
      const first = query(collection(db, "helpers"), orderBy("name"), limit(10));
      const documentSnapshots = await getDocs(first);
      const users = documentSnapshots.docs.map(doc => doc.data());
      setHelpers(users);
      // Do something with the document snapshots here
    };
  
    fetchData();
  
    return () => {
      // Clean up any resources here if necessary
    };
  }, []);
  return (
    <div className='hm-cards-container '>
        {helpers ? (
          <>
          {
          helpers.map((p)=>{
            return(
              <>
              <HMCard name={p.name} age={p.age} location={p.city} wage={p.wages} verified={p.verified} profileImg={p.profileImg} key={p.id}/>
              </>
            )
          })
        }</>
        ):(
          <div style={{width:'100%'}}>
            <h1 style={{textAlign:'center'}}>Loading...</h1>
          </div>
        )}
    </div>
  )
}

export default HMCards