# Portrety osób z pokazu (app/img/osoby/*.webp). Osoby są FIKCYJNE; obrazy powstają lokalnie, na CPU (ok. 1 min na obraz).
#
#   python3 -m venv sd && sd/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
#   sd/bin/pip install diffusers transformers accelerate safetensors peft pillow
#   sd/bin/python narzedzia/portrety.py
#
# Modele (Hugging Face, licencja CreativeML OpenRAIL-M; LoRA: MIT):
#   1. SG161222/Realistic_Vision_V5.1_noVAE + stabilityai/sd-vae-ft-mse: portret redakcyjny (zdjęcie, miękkie światło),
#   2. Lykon/dreamshaper-8: ten sam portret przerysowany jako ilustracja (img2img, siła 0,8), twarz i kadr zostają,
#   oba z latent-consistency/lcm-lora-sdv1-5 (kilka kroków zamiast kilkudziesięciu).
import os, torch
from PIL import Image
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, LCMScheduler, AutoencoderKL
torch.set_num_threads(os.cpu_count() or 4)
APP = os.environ.get('PORTRETY_OUT') or os.path.join(os.path.dirname(__file__), '..', 'app', 'img', 'osoby')
os.makedirs(APP, exist_ok=True)

def lcm(pipe):
    pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)
    pipe.load_lora_weights('latent-consistency/lcm-lora-sdv1-5'); pipe.fuse_lora(); pipe.set_progress_bar_config(disable=True)
    return pipe

# 1. Portret redakcyjny (zdjęcie). Opis osoby i ziarno.
ZDJECIE = ('editorial portrait photograph of {o}, medium shot from the chest up, whole head in frame, gentle natural smile, soft window light, '
           'plain pastel blue studio backdrop, 85mm lens, shallow depth of field, modern color grading, photorealistic')
ZDJECIE_NEG = 'text, watermark, cartoon, illustration, 3d render, deformed, blurry, oversaturated, harsh shadows'
OSOBY = {
  'anna':   ('a 33-year-old Polish woman, shoulder-length brown hair, light skin, navy blazer over white blouse', 101),
  'halina': ('a 78-year-old Polish woman, short neat grey hair, thin metal glasses, kind face with natural wrinkles, purple cardigan', 202),
  'kasia':  ('a 29-year-old Polish woman, long light auburn hair, freckles, mustard knit sweater', 404),
}
JAKUB = ('editorial portrait photograph of a 17-year-old Polish boy, short dark brown hair, plain teal hoodie without any print, '
         'medium shot from the chest up, whole head in frame, facing the camera, gentle natural smile, soft window light, '
         'plain pastel blue studio backdrop, 85mm lens, shallow depth of field, modern color grading, photorealistic',
         'text, letters, logo, print on clothes, crossed arms, hood on head, watermark, cartoon, deformed, blurry', 311)

foto = lcm(StableDiffusionPipeline.from_pretrained('SG161222/Realistic_Vision_V5.1_noVAE', vae=AutoencoderKL.from_pretrained('stabilityai/sd-vae-ft-mse'),
                                                   safety_checker=None, requires_safety_checker=False))
zdjecia = {}
gen = lambda pipe, p, n, z, **k: pipe(p, negative_prompt=n, guidance_scale=1.6, generator=torch.Generator().manual_seed(z), **k).images[0]
for k, (o, z) in OSOBY.items():
    zdjecia[k] = gen(foto, ZDJECIE.format(o=o), ZDJECIE_NEG, z, num_inference_steps=6, width=512, height=640)
zdjecia['jakub'] = gen(foto, JAKUB[0], JAKUB[1], JAKUB[2], num_inference_steps=6, width=512, height=640)
del foto

# 2. Ilustracja: model ilustracyjny przerysowuje zdjęcia; niemowlę powstaje od razu w nim.
RYS = ('modern editorial illustration portrait of {o}, gentle expression, digital painting with soft visible brush strokes, '
       'simplified shapes, clean shading, muted harmonious palette, plain flat {t} background, realistic adult proportions')
RYS_NEG = 'photo, photograph, photorealistic, anime, chibi, big eyes, childish, cartoon, 3d render, text, letters, watermark, deformed'
OPISY = {
  'anna':   ('a 33-year-old woman, shoulder-length brown hair, cream blazer', 'pastel blue'),
  'halina': ('a 78-year-old woman with natural wrinkles, short grey hair, glasses, lilac cardigan', 'pastel lavender'),
  'jakub':  ('a 17-year-old boy, short dark brown hair, teal hoodie', 'pastel mint'),
  'kasia':  ('a 29-year-old woman, auburn hair, freckles, cream knit sweater', 'pastel peach'),
  'niemowle': ('a sleeping newborn baby wrapped in a soft yellow blanket, knitted hat', 'pastel mint'),
}
rys = lcm(StableDiffusionImg2ImgPipeline.from_pretrained('Lykon/dreamshaper-8', torch_dtype=torch.float32, safety_checker=None,
                                                         requires_safety_checker=False).to(torch.float32))
t2i = StableDiffusionPipeline(**rys.components)
zdjecia['niemowle'] = gen(t2i, 'semi-realistic digital illustration of a sleeping newborn baby girl, head and shoulders, wrapped in a soft yellow blanket, '
                          'knitted teal hat, peaceful, painterly, soft visible brush strokes, muted pastel palette, plain pastel mint background',
                          RYS_NEG, 21, num_inference_steps=6, width=512, height=512)
for k, (o, t) in OPISY.items():
    img = gen(rys, RYS.format(o=o, t=t), RYS_NEG, 7, image=zdjecia[k].convert('RGB'), strength=0.8, num_inference_steps=10)
    if k == 'niemowle': img = img.crop((64, 0, 448, 384)).resize((256, 256), Image.LANCZOS)
    else: img = img.resize((320, 400), Image.LANCZOS)
    img.convert('RGB').save(os.path.join(APP, k + '.webp'), 'WEBP', quality=80, method=6)
    print('app/img/osoby/' + k + '.webp', flush=True)
