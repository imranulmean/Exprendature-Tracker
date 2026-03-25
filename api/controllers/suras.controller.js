import axios from 'axios';
import * as cheerio from 'cheerio';

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
        const pageHTML1 = await axios.get(`${mainSource}${req.params[0]}`,{
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