let products=[],category='todos',cart={};
const $=s=>document.querySelector(s), money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
async function init(){products=await fetch('products.json').then(r=>r.json());bind();render();updateCart();}
function bind(){
 $('#search').addEventListener('input',render);
 document.querySelectorAll('#filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');category=b.dataset.category;render();}));
 $('#openCart').onclick=openCart;$('#openCartFloat').onclick=openCart;$('#closeCart').onclick=closeCart;$('#closeBackdrop').onclick=closeCart;$('#sendOrder').onclick=sendOrder;
}
function render(){
 const q=$('#search').value.toLowerCase();
 const list=products.filter(p=>(category==='todos'||p.category===category)&&(p.name+' '+(p.description||'')).toLowerCase().includes(q));
 const cards=list.filter(p=>p.image), rows=list.filter(p=>!p.image);
 let html='';
 if(cards.length)html+=`<div class="grid">${cards.map(p=>`<article class="card"><img loading="lazy" src="${p.image}" alt="${p.name}"><div class="body"><h3>${p.name}</h3><div class="desc">${p.description||''}</div><div class="bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="add('${p.id}')">Adicionar</button></div></div></article>`).join('')}</div>`;
 if(rows.length)html+=`<div class="list" style="margin-top:${cards.length?'22px':'0'}">${rows.map(p=>`<div class="row"><div><strong>${p.name}</strong>${p.description?`<small>${p.description}</small>`:''}</div><span class="price">${money(p.price)}</span><button class="add" onclick="add('${p.id}')">Adicionar</button></div>`).join('')}</div>`;
 $('#products').innerHTML=html||'<p>Nenhum produto encontrado.</p>';
}
window.add=id=>{cart[id]=(cart[id]||0)+1;updateCart();}
window.change=(id,d)=>{cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];updateCart();renderCart();}
function summary(){let count=0,total=0;Object.entries(cart).forEach(([id,q])=>{const p=products.find(x=>x.id===id);if(p){count+=q;total+=p.price*q}});return{count,total}}
function updateCart(){const s=summary();$('#cartCount').textContent=s.count;$('#floatCount').textContent=s.count;$('#floatTotal').textContent=money(s.total);$('#cartFloat').classList.toggle('show',s.count>0);}
function openCart(){renderCart();$('#drawer').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){$('#drawer').classList.remove('show');document.body.style.overflow=''}
function renderCart(){const items=Object.entries(cart);$('#cartItems').innerHTML=items.length?items.map(([id,q])=>{const p=products.find(x=>x.id===id);return`<div class="cart-item"><div><strong>${p.name}</strong><div>${money(p.price*q)}</div></div><div class="qty"><button onclick="change('${id}',-1)">−</button><b>${q}</b><button onclick="change('${id}',1)">+</button></div></div>`}).join(''):'<p>Seu carrinho está vazio.</p>';$('#cartTotal').textContent=money(summary().total)}
function sendOrder(){const items=Object.entries(cart);if(!items.length)return alert('Adicione pelo menos um item.');let t='Olá! Vim pelo cardápio digital da Famous Burger.\n\n*MEU PEDIDO:*\n';items.forEach(([id,q])=>{const p=products.find(x=>x.id===id);t+=`${q}x ${p.name} — ${money(p.price*q)}\n`});t+=`\n*TOTAL ESTIMADO:* ${money(summary().total)}`;const n=$('#notes').value.trim();if(n)t+=`\n\n*OBSERVAÇÕES:*\n${n}`;t+='\n\nPodem confirmar o pedido, prazo e taxa de entrega?';location.href='https://wa.me/5511998044222?text='+encodeURIComponent(t)}
init();