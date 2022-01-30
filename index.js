import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import cors from "cors";  


dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection(){
    const client =  new MongoClient(MONGO_URL); 
    await client.connect();  
    console.log("Mongodb Connected");
    return client;
}
const client = await createConnection();


app.get("/",(request,response)=>{
    response.send("hello happy world");
});

app.get("/bloglist", async (request,response)=>{
    const blog = await client 
    .db("b28wd")
    .collection("blog")
    .find({})
    .toArray();
    response.send(blog);
});

app.get("/bloglist/:id", async (request,response)=>{
    console.log(request.params);
    const {id} = request.params;
	const blogresult = await getBlogById(id);
    console.log(blogresult);

    blogresult? response.send(blogresult) : response.status(404).send({message:"no matching movie found"});
});

app.post("/bloglist", async (request,response)=>{
    const data = request.body;
    const result = await client.db("b28wd").collection("blog").insertOne(data);
    response.send(result);
    });

    app.put("/bloglist/:id", async (request,response)=>{
        console.log(request.params);
        const {id} = request.params;
        const data = request.body;
        const result = await editBlogById(id, data);
        const blogresult = await getBlogById(id);
        console.log(result);
        response.send(blogresult);
    });

    async function editBlogById(id, data) {
        return await client
            .db("b28wd")
            .collection("blog")
            .updateOne({ _id: ObjectId(id) }, { $set: data });
    }

    async function getBlogById(id) {
        return await client
            .db("b28wd")
            .collection("blog")
            .findOne({ _id: ObjectId(id) });
    }

    async function createUser(data) {
        return await client.db("b28wd").collection("projectpassword").insertOne(data);
    }
    
    async function getUserByName(email) {
        return await client
            .db("b28wd")
            .collection("projectpassword")
            .findOne({ email: email });
    }
    
    
    
    async function genPassword(password){
        const NO_OF_ROUNDS = 10;
        const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
        console.log(salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
        return hashedPassword;
    }
    
    
    app.post("/signup", async (request,response)=>{
        const {email, password} = request.body;
        const userFromDB = await getUserByName(email);
    console.log(userFromDB);
    
    if(userFromDB){
        response.send({message: "email already exists"});
        // response.status(400).send({message: "email already exists"});
        return;
    }
    
    if(password.length < 8){
        response.send({message: "password must be longer"});
        // response.status(400).send({message: "password must be longer"});
        return;
    }
    
    
        const hashedPassword = await genPassword(password); 
        const result = await createUser({ email, password:hashedPassword });
        response.send(result);   
        });
    
    app.post("/login", async (request,response)=>{
        const {email, password} = request.body;
        const userFromDB = await getUserByName(email);
    
        if(!userFromDB){
            response.send({message: "Invalid Credentials"});
            // response.status(401).send({message: "Invalid Credentials"});
            return;
        }
    
        const storedPassword = userFromDB.password;
        console.log(storedPassword);
    
        const isPasswordMatch = await bcrypt.compare(password, storedPassword);
    
        console.log(isPasswordMatch);
        console.log(userFromDB);
    
        if (isPasswordMatch) {
            
            response.send({message: "sucessful login"});
        }else{
            response.send({message: "Invalid Credentials"});
            // response.status(401).send({message: "Invalid Credentials"});
        }
    
        
    });

app.listen(PORT,()=>console.log("App is started in", PORT));


// const INITIAL_BLOGS = [
//     {id:"101", picture:"https://s1.1zoom.me/big0/504/Cosmos_plant_Sky_Clouds_587191_1280x854.jpg", moredetails:`A number of years ago I went on holiday to a beautiful part of Portugal. We stayed in a converted farmhouse in the middle of a national park. The farmhouse was in a valley. We arrived in the evening when the birds were just starting to roost. It was still warm and the air smelled sweet with pollen. You could hear the hum of crickets. A small river flowed through that valley. We opened a rickety gate and crossed a small wooden bridge. As we walked along the narrow path that led to our house I had a clear vision of what my morning routine would be like for the next fourteen days. I had been working hard for the last few months and I felt tired. I wanted this holiday to be a mini retreat. I would wake up early each day when it was still quite cool and I would meditate for a while. I imagined myself sitting in a peaceful spot, my mind calm, my body relaxed… listening to the river flowing, hearing the birds and wildlife starting to stir, feeling the first rays of the early morning sun hit my face as it rose over the top of the hill. Present. Even as I write this now, it sounds like paradise to me.
//     I work up early the next morning and it was just as I imagined it would be. There is nothing like the stillness of the early morning. There was a gentle, peaceful feeling that enveloped me. It didn’t come from me but seemed to come from the earth and the river and the mountains. Everything was clearer than usual. The mind wasn’t racing here and there the way it normally does. I had never been to this place before but it felt welcoming and familiar. I found a spot to sit quietly. I could hear the faint hum of insects. The air was very still and there was only an occasional gentle breeze. A fly landed on my face. After a moment or two I carefully lifted my hand and gently ushered him away. Then another fly landed on my face. And another. And another. The feeling I had experienced a few moments ago was gone. I endured thirty minutes or so of mild torture that first morning before I admitted defeat and retreated to the farmhouse.
//     In the ensuing days I experimented with different approaches. I went to a different spot to try and escape the flies. I went at different times of the day. 
//     The familiar feeling of a fly landing on my face. Except this time my natural response was to smile: “thank you for reminding me to bring my attention back to the present Mr Fly”! I noticed the feeling of gratitude and appreciation. The sensations were no longer unpleasant. With each movement the fly was reminding me to stay here with my present moment experience. That fly was my teacher. Nature was my teacher.
//     So you’ve read this short story. More words. More intellectual ideas. Maybe you agree and you have decided to accept the idea or maybe you disagree and have decided to reject the idea. It doesn’t matter. An intellectual understanding of something is not the same as a lived experience.  Trust me… you need to find out for yourself. Carry out your own experiment. Sit quietly under a tree and see what happens when you allow EVERYTHING to be exactly as it is.
//     When something is completely beyond your control see for yourself which causes you more suffering.`, heading:"Nature is a teacher What happens when you allow everything to be 'as it is?'", summary:"A number of years ago I went on holiday to a beautiful part of Portugal. We stayed in a converted farmhouse in the middle of a national park. The farmhouse was in a valley. We arrived in the evening when the birds were just starting to roost. It was still warm and the air smelled…"},
//     {id:"102", picture:"https://motionarray.imgix.net/preview-109213-9FT2hfCn5w-high_0004.jpg", moredetails:`In a very real sense, mountains and valleys, the seas and the skies, the sun and the earth, the trees and the flowers constitute our home, our natural habitat.
//     Growing up in the modern developed world we can easily come to believe that towns and cities – the urban and artificial environment – is where we naturally belong. But our brains and bodies, which evolved over thousands of years, were designed by and designed for an environment very different to the one we live in now.
//     Throughout our evolutionary history we lived in very close connection to the land, with a very close kinship with other creatures. Our physiological system evolved to survive in wild, natural environments and developed a love and kinship for these places that lives on in our DNA.
//     This connection with the land combined with the kinship we would have felt with other living things that shared the land as their home has hardwired in us a strong sense of the natural world as ‘home’, and the importance of connection with all of life as being essential to our well-being.
//     This ‘love for life’ or biophilia, is a basic need in human beings. But unfortunately, because of the increasingly urbanised nature of the modern world, many of us have become disconnected from nature and suffer from what Richard Louv calls ‘Nature-deficit disorder’. We have been left deprived of something that was a source of so much spiritual sustenance and nourishment since we first walked the earth, a loss which has undoubtedly effected our collective health and well-being.
//     Science is now backing up what most of us who have spent any amount of time in the outdoors intuitively know: Nature is good for us. Spending time in nature has been shown to decrease stress, alleviate depression and anxiety, improve memory, creativity, and cognitive functioning, as well as increase energy levels, boost immunity, and decrease inflammation.`, heading:"The hug of homecoming: Hedonism in the natural world", summary:"“Nature is not a place to visit. It is home.” Gary Snyder In a very real sense, mountains and valleys, the seas and the skies, the sun and the earth, the trees and the flowers constitute our home, our natural habitat. Growing up in the modern developed world we can easily come to believe…"},
//     {id:"103", picture:"https://cdn.shopify.com/s/files/1/0326/7189/articles/mother-trees-blog_2000x.jpg?v=1617381126", moredetails:`How surely gravity’s law,
//     strong as an ocean current,takes hold of even the strongest thing and pulls it toward the heart of the world. Each thing- each stone, blossom, child – is held in place. Only we, in our arrogance, push out beyond what we belong to for some empty freedom. If we surrendered to earth’s intelligence we could rise up rooted, like trees. Instead we entangle ourselves in knots of our own making and struggle, lonely and confused. So, like children, we begin again to learn from the things, because they are in God’s heart; they have never left him. This is what the things teach us: to fall, patiently trusting our heaviness.Even a bird has to do that before he can fly. -Rainer Maria Rilke, Rilke’s Book of Hours: Love Poems to God`,heading:"Earth's intelligence: Being pulled toward the heart of the world", summary:"How surely gravity law, strong as an ocean current, takes hold of even the strongest thing and pulls it toward the heart of the world. Each thing- each stone, blossom, child – is held in place. Only we, in our arrogance, push out beyond what we belong to for some empty freedom. If we surrendered…"},
//     {id:"104", picture:"https://w0.peakpx.com/wallpaper/62/191/HD-wallpaper-superb-river-view-tree-mountains-river-sky-meadow.jpg", moredetails:`The world is animated by the wind. This invisible, mysterious force can bring a landscape alive. Its absence can cast a calm stillness over the earth. On barren mountain tops its power is barely perceptible; in forests and seas its presence becomes manifest.
//     Winds are wild, and sometimes destructive. The wind is a river and in its torrent clouds race each other seeking shelter, refuge from the howling ghosts of moving air.`,heading:"Connecting with nature: The practice of 'wind-watching'", summary:"The world is animated by the wind. This invisible, mysterious force can bring a landscape alive. Its absence can cast a calm stillness over the earth. On barren mountain tops its power is barely perceptible; in forests and seas its presence becomes manifest. Winds are wild, and sometimes destructive. When we look deeply into the…"},
//     {id:"105", picture:"https://c4.wallpaperflare.com/wallpaper/955/500/1010/tree-sun-light-summer-forest-wallpaper-preview.jpg", moredetails:`A sinking, uncomfortable feeling that I know all too well. It is the same feeling that comes on Sunday evenings as another week in the office beckons. The same feeling that comes when the long awaited annual two week holiday is almost over. I remember the exact same feeling a few years ago when I was travelling – I was sitting in a small coffee shop in Bali when I realised that I had passed the half way point of my trip. It hit me hard then. The party would soon be over. The glass was now more empty than full.
//     This feeling has been with me in one way or another for most of my adult life. Now, as I sit in my favourite place under this old tree I can feel it again. The days are getting shorter and colder. Soon the trees will be bare. I can’t quite put my finger on it but it feels like the sands of time are running out. There is a hollow feeling in my chest.
//     For years, I would go to great lengths to avoid this feeling. I would busy myself with some mundane task. I would exercise, work, read, meet my friends, text someone… anyone, open a bottle of wine, watch another box set, go for a pint, even meditate or practice yoga. Anything to anesthetise myself and escape this feeling.
//     No matter what I did the feeling never really went away. It’s always there. I don’t think I’m alone. I think most of us spend our whole lives running from it in one way or another.
//     As I sit, I can feel the gentle breeze on my skin. I can hear the leaves softly stirring. The blue sky above invites a broader perspective. It’s not all about me. I’m just an insignificant speck in the bigger picture. I am a tiny part of a much bigger whole. The tree I am sitting under has been here for a long time and it will probably still be here long after I’m gone. I feel a softening, a release of tension. I know this place. I feel safe here. I don’t have to run anymore. I don’t have to escape or avoid this feeling. I can just sit here quietly and be with my experience exactly as it is.`,heading:"Nature is a teacher Just sit quietly under a tree", summary:"As I sit outside under an old plane tree that I know very well, I get the sense that summer is slowly coming to a close. A feeling accompanies this realisation. A sinking, uncomfortable feeling that I know all too well. It is the same feeling that comes on Sunday evenings as another week in…"},
//     {id:"106", picture:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-w_XH_BVJ7ATY0mn-YhzPBiwGDsQs_xrEnKThmz3uPnzT1d0NF57Z-GarJ_CyYtXatsY&usqp=CAU", moredetails:`I was working as a lawyer at the time and I used to walk down a little lane way to the train station on my commute to work. It’s not an especially beautiful lane way – a concrete footpath, metal gates on one side and some shrubs and bushes on the other side. I must have walked this exact same route a thousand times before.
//     Except today it was different. I couldn’t explain it but it was as if I was seeing this place for the very first time. I saw bees moving frantically amongst the flowers. The colours were so incredibly vivid. Were these same flowers here yesterday? Had someone come in the middle of the night and changed everything? It felt like that. There were so many details I had never seen before. It was disconcerting and in a way, almost frightening. I was usually a very brisk, purposeful walker but now my pace slowed. I looked around. There was so much life. So much movement. I felt an emotion that wasn’t at all familiar to me in those days…. pure joy. I could feel it intensely in my body. I just wanted to bask in all this beauty. I had been asleep, dead and now, finally I was awake.
//     It’s not an uncommon experience when someone starts to practice mediation. As we start to slow down and stop living so much in our heads, we can experience a shift in perspective. Sometimes it is more gradual and subtle, but in my case it was quite sudden and dramatic.
//     In the weeks and months that followed, I came to relish my daily walk down this little lane way. I didn’t listen to my iPod anymore. I listened to the birds signing and the wind moving amongst the trees. Every day I came to the start of the lane way expecting something magical.`,heading:"Seeing with “fresh eyes” - A deeper nature experience", summary:"Around the time I first learned how to meditate, something amazing happened to me. It happened one day, quite spontaneously.  I was working as a lawyer at the time and I used to walk down a little lane way to the train station on my commute to work. It's not an especially beautiful lane way …"},
//     {id:"107", picture:"https://data.1freewallpapers.com/download/sea-coast-purple-flowers-green-grass-leaves-field-ocean-waves-during-sunset-nature.jpg", moredetails:`For this exercise find a place, any place, with some nature present (which, let’s face it, is anywhere and everywhere; the air you are breathing right now, even the body with which you perceive the world is part of ‘nature’).
//     In this practice, we begin by honing our powers of perception. Imagine you have just landed here on planet Earth and are experiencing this reality for the first time. What are you curious about? What do you notice? What aspects of the environment draw your attention?
//     Open and engage all the senses. What is it to see, hear, feel, smell? Direct your attention towards something that gives you pleasure in or around you. Allow your attention to be sustained on this object. Resist the habitual tendency to move on quickly to something else. Stay with it, explore and investigate all its qualities with the senses.
//     What happens when you stay with the experience? Often the more we look, the more we see, as new layers of detail begin to emerge as the subtleties and nuances of an image give themselves up to the patient eye. Rich detail that we never imagined existed in something so ‘everyday’, begins to emerge.
//     Once you have ‘perceived’ it, then open fully to ‘receiving’ it – open to the experience as if you were taking it in to your mind and body, savouring and enjoying the details, the nuances, and the flavours of experience.
//     It starts with intention – deliberately guiding your attention towards a particular object; then perception – attending to what you are perceiving. Then we can experiment with simply opening and surrendering to the experience; to really allow the experience to nourish you, you can imagine the experience flowing into you, as you simply open and receive the goodness that you perceive.`,heading:"Nature Connection Exercise - Perceive and Receive", summary:"For this exercise find a place, any place, with some nature present (which, let’s face it, is anywhere and everywhere; the air you are breathing right now, even the body with which you perceive the world is part of 'nature'). In this practice, we begin by honing our powers of perception. Imagine you have just…"},
//     {id:"108", picture:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkAypk-aiH7Zbts8sgU_Or78Sa1uPpkitVP3t10SVmbYDoZ0j89cga9HtAEUO-NvvblBY&usqp=CAU", moredetails:`I am sitting on my balcony. It is spring and there is a little bit of heat in the sun. The balcony looks out over a road. The road is usually busy… an endless stream of trucks and cars but right now there is no traffic. Everyone is self-isolating. The machine has stopped. It feels strange. Peaceful. I can hear different birds… the wren, the blackbird, the robin. A blue tit is flitting from one branch to the next. Life goes on. I could sit here all day.“Don’t try”. Those are the two simple words of advice offered by the poet Charles Bukowski.It jars for most people to receive that advice… especially those of us who want a better world.I have been stuck in a cycle of “trying” for a while now and I see a lot of it in the worldTrying and searching and wanting.Everywhere I look people, including me, are rushing to the next moment.I know that 99% of people probably won’t resonate with what I’m going to say. They might think that I’m an idiot and that this piece is a cop out.Not trying is seen as the “worst”.It means that you are lazy and you don’t care.It means that you settle.It means that you do nothing.It means that you are part of the problem.It means that you are helpless.Is that really true?I don’t think so.Does the oak tree try?No. It just is.Does the oak tree do nothing?No. It just is.Why is it that we humans are always trying and searching and wanting?Don’t rush. Close your eyes and sit with that question for a moment.`,heading:"Trying and searching and wanting", summary:"I am sitting on my balcony. It is spring and there is a little bit of heat in the sun. The balcony looks out over a road. The road is usually busy… an endless stream of trucks and cars but right now there is no traffic. Everyone is self-isolating. The machine has stopped. It feels…"}
//   ]