import  RSSParser from "rss-parser";
import axios from 'axios';
import * as cheerio from 'cheerio';

const parser = new RSSParser({
    customFields: {
      item: [
        ['media:thumbnail', 'media:thumbnail'],
        ['media:content', 'media:content'],
        ['media:group', 'media:group']
      ]
    }
  });

const SOURCES = {
    bbc: "http://feeds.bbci.co.uk/news/rss.xml",
    aljazeera: "https://www.aljazeera.com/xml/rss/all.xml",
    guardian: "https://www.theguardian.com/world/rss",
    cnn: "http://rss.cnn.com/rss/edition.rss",
    // npr: "https://feeds.npr.org/1001/rss.xml",
};

const getImage = async(pageLink) =>{
    const pageHTML1 = await axios.get(`${pageLink}`,{
        'headers':{
          'Content-Type': 'application/json',
        }
    });
    const $ = cheerio.load(pageHTML1.data);
    const image= $('.vertical-video-thumbnail .responsive-image img').attr('src') || $('.article-featured-image .responsive-image img').attr('src')
    return `https://www.aljazeera.com${image}`;
}

function getSourceName(source) {
    switch (source) {
      case 'bbc': return 'BBC';
      case 'aljazeera': return 'ALJAZEERA';
      case 'guardian': return 'The GUARDIAN';
      case 'cnn': return 'CNN';
    }
}

export const getNews = async (req, res) =>{
    const {source} = req.params;
    try {
        const news= await parser.parseURL(SOURCES[source]);
        const newsArray = await Promise.all(
            news.items.map(async(item)=>{
                let imageLink= item['media:thumbnail']?.['$']?.url || 
                item['media:content']?.['$']?.url || 
                item['media:group']?.['media:content'][0]?.['$']?.url;
    
                if(source === 'aljazeera'){
                    imageLink= await getImage(item.link)
                }
                return{
                    title: item.title,
                    link: item.link,
                    image: imageLink,
                    content:item.content,
                    contentSnippet:item.contentSnippet,
                }
            })             
        ) 
       
        res.status(200).json({
            success: true, message: newsArray , mainSource: getSourceName(source)
        });        
    } catch (error) {
        res.status(403).json({
            success: false, message: error.message
        });        
    }

}
