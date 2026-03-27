import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import Hadith from '../models/hadith.model.js';

const mainSource='https://alquran.cloud';

export const getSuras = async (req, res) =>{
    try {
        const pageHTML1 = await axios.get(`${mainSource}/surahs`,{
            'headers':{
              'Content-Type': 'application/json',
            }
        });
        const $ = cheerio.load(pageHTML1.data);
        let suras= Array.from($('.col-md-6.ltr'))
        let names= suras.map(sura=>(     
             {
                name: $(sura).find('.lead').text().replace(/[\n\t\r\s]+/g, ' ').trim(),
                link: $(sura).find('a').attr('href') 
        
             }
        ))
        res.status(200).json({
            success: true, message: names 
        });        
    } catch (error) {
        res.status(403).json({
            success: false, message: error.message
        });        
    }

}

export const getSuraDetails = async (req, res) =>{
    try {
        const pageHTML1 = await axios.get(`${mainSource}/${req.params[0]}`,{
            'headers':{
              'Content-Type': 'application/json',
            }
        });

        const $ = cheerio.load(pageHTML1.data);
        let ayats= Array.from($('.zoomIntoThisAyah'))
        let verses= ayats.map(ayat=>(
            {   
                ayatNumber: $(ayat).attr('data-number'),
                ayat:$(ayat).closest('.style-ayah').text().replace(/[\n\t\r\s]+/g, ' ').trim()
            }            
        ))
        res.status(200).json({
            success: true, message: verses 
        });        
    } catch (error) {
        res.status(403).json({
            success: false, message: error.message
        });        
    }

}

import path from 'path';
import { fileURLToPath } from 'url';

// let myHadithTabContent= Array.from(document.querySelectorAll('#myHadithTabContent'));
// let texts= myHadithTabContent.map(tab=>{
//     let fontArabic= tab.querySelector('.font-arabic');
//     let arabicText= Array.from(fontArabic.querySelectorAll('span.arabic-text')).map(text=>{
//         return text.innerText.trim();
//     })

//     let banglaDiv=tab.querySelector('.order-2');
//     let title= banglaDiv.querySelector('.my-3').innerText;
//     let banglaText= Array.from(banglaDiv.querySelectorAll('span p')).map(text=>{
//         return text.innerText.trim();
//     })

//     let obj={
//         arabicText,
//         title,
//         banglaText
//     }
//     return obj
// })
// console.log(texts)


export const getHadits = async (req, res) =>{
    try {
        let names=[
            {
                name:'সহীহ বুখারী',
                nameEnglish:'Sahi Bukhari',
                link:'/hadithContent/bukhari'
            },
            {
                name:'সহীহ মুসলিম',
                nameEnglish:'Sahi Muslim',
                link:'/hadithContent/muslim'
            },
            {
                name:'সুনান আবূ দাউদ',
                nameEnglish:'Sunan Abu Daud',
                link:'/hadithContent/sunan_abu_daud'
            }            
            
        ] 
        res.status(200).json({
            success: true, message: names 
        });        
    } catch (error) {
        res.status(403).json({
            success: false, message: error.message
        });        
    }

}

export const getHadithContent = async (req, res) => {
    const bookName = req.params[0].replace('hadithContent/', '');

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Hadith.countDocuments({ bookName });
        const hadiths = await Hadith.find({ bookName })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            message: hadiths
        });

    } catch (error) {
        res.status(403).json({
            success: false, message: error.message
        });
    }
}

