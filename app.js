const products = [
{
    id:"KBL-1HP-MB",
    name:"Kirloskar 1HP Monoblock Pump",
    category:"monoblock",
    brand:"kirloskar",
    hp:1,
    voltage:230,
    flow:120,
    stock:true
},
{
    id:"CRI-3HP-SUB",
    name:"CRI 3HP Submersible Pump",
    category:"submersible",
    brand:"cri",
    hp:3,
    voltage:415,
    flow:300,
    stock:false
}
];

let enquiryCart=[];
const grid=document.getElementById("productGrid");
const cartBadge=document.getElementById("cartBadge");

function debounce(fn,delay){
    let t;
    return (...args)=>{
        clearTimeout(t);
        t=setTimeout(()=>fn.apply(this,args),delay);
    };
}

function renderProducts(list){
    grid.innerHTML="";
    if(!list.length){
        grid.innerHTML="<p>No products found.</p>";
        return;
    }

    list.forEach(p=>{
        const div=document.createElement("div");
        div.className="card";
        div.innerHTML=`
            <h3>${p.name}</h3>
            <div class="spec">SKU: ${p.id}</div>
            <div class="spec">HP: ${p.hp}</div>
            <div class="spec">Voltage: ${p.voltage}V</div>
            <div class="spec">Flow: ${p.flow} LPM</div>
            <div class="stock ${p.stock?"instock":"outstock"}">
                ${p.stock?"In Stock":"Out of Stock"}
            </div>
            <button onclick="addToCart('${p.id}')">Add to Enquiry</button>
        `;
        grid.appendChild(div);

        injectProductSchema(p);
    });
}

function filterProducts(){
    const params=new URLSearchParams(window.location.search);

    let filtered=[...products];

    const search=document.getElementById("searchInput").value.toLowerCase();
    const category=document.getElementById("categoryFilter").value;
    const brand=document.getElementById("brandFilter").value;
    const hp=document.getElementById("hpFilter").value;
    const voltage=document.getElementById("voltageFilter").value;
    const stock=document.getElementById("stockFilter").checked;
    const sort=document.getElementById("sortFilter").value;

    if(search){
        filtered=filtered.filter(p=>
            p.name.toLowerCase().includes(search) ||
            p.id.toLowerCase().includes(search) ||
            p.brand.includes(search)
        );
    }

    if(category) filtered=filtered.filter(p=>p.category===category);
    if(brand) filtered=filtered.filter(p=>p.brand===brand);
    if(hp) filtered=filtered.filter(p=>p.hp==hp);
    if(voltage) filtered=filtered.filter(p=>p.voltage==voltage);
    if(stock) filtered=filtered.filter(p=>p.stock);

    if(sort==="az") filtered.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==="hpLow") filtered.sort((a,b)=>a.hp-b.hp);
    if(sort==="stock") filtered.sort((a,b)=>b.stock-a.stock);

    renderProducts(filtered);
    updateURL(category,brand,hp,voltage);
}

function updateURL(category,brand,hp,voltage){
    const params=new URLSearchParams();
    if(category) params.set("category",category);
    if(brand) params.set("brand",brand);
    if(hp) params.set("hp",hp);
    if(voltage) params.set("voltage",voltage);
    history.replaceState(null,"","?"+params.toString());
}

function addToCart(id){
    if(!enquiryCart.includes(id)) enquiryCart.push(id);
    cartBadge.textContent=enquiryCart.length;
    updateEnquiryBox();
}

function updateEnquiryBox(){
    const box=document.getElementById("enquiryBox");
    const list=document.getElementById("enquiryList");
    list.innerHTML="";
    enquiryCart.forEach(id=>{
        const li=document.createElement("li");
        li.textContent=id;
        list.appendChild(li);
    });
    if(enquiryCart.length) box.classList.remove("hidden");
}

document.getElementById("whatsappBtn").addEventListener("click",()=>{
    let message="Hello, I need quotation for:\n";
    enquiryCart.forEach(id=>message+="- "+id+"\n");
    window.open("https://wa.me/91XXXXXXXXXX?text="+encodeURIComponent(message));
});

function injectProductSchema(product){
    const script=document.createElement("script");
    script.type="application/ld+json";
    script.textContent=JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Product",
        "name":product.name,
        "sku":product.id,
        "brand":product.brand,
        "offers":{
            "@type":"Offer",
            "availability":product.stock?
            "https://schema.org/InStock":
            "https://schema.org/OutOfStock"
        }
    });
    document.head.appendChild(script);
}

document.querySelectorAll("select,input").forEach(el=>{
    el.addEventListener("change",filterProducts);
});

document.getElementById("searchInput")
.addEventListener("input",debounce(filterProducts,300));

renderProducts(products);