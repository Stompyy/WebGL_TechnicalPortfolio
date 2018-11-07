class gazcanvas
{
    constructor()
    {
        this.currentScreenSize = new Size();
        this.referenceScreenSize = new Size();
        this.offset = new Size(0,0);
        this.targetSize = new Size(0,0);
    }

    Update()
    {
        this.currentScreenSize = new Size(window.innerWidth, 1.5*window.innerWidth);
    
        let canvas = document.getElementById("displaycanvas");
        let ctx = canvas.getContext("2d");
    
        ctx.canvas.width  = this.currentScreenSize.w;
        ctx.canvas.height = this.currentScreenSize.h;
    
        this.targetSize = new Size(0,0);
    
        this.targetSize.h = this.currentScreenSize.h;
        this.targetSize.w = (this.targetSize.h * this.referenceScreenSize.w / this.referenceScreenSize.h);
    
        if(this.targetSize.w > this.currentScreenSize.w)
        {
            this.targetSize.w = this.currentScreenSize.w;
            this.targetSize.h = (this.targetSize.w*this.referenceScreenSize.h) / this.referenceScreenSize.w;
        }
        
        this.offset.x = this.currentScreenSize.w - this.targetSize.w;
        this.offset.y = this.currentScreenSize.h - this.targetSize.h;
    }

    toScreenSpace(inRect)
    {
        let drawRect = new Rect();
        drawRect.x = ((inRect.x / this.referenceScreenSize.w) * this.targetSize.w) + this.offset.x/2;
        drawRect.y = ((inRect.y / this.referenceScreenSize.h) * this.targetSize.h) + this.offset.y/2;
        drawRect.w = (inRect.w / this.referenceScreenSize.w) * this.targetSize.w;
        drawRect.h = (inRect.h / this.referenceScreenSize.h) * this.targetSize.h;

        return drawRect;
    }
    
    Line(start,end,inColour, inWidth)
    {
        let r = new Rect();
        
    
        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);

        let v0 = new Vector2(r.x,r.y);
        
    
        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);

        let width = Math.min(r.w,r.h);

        let v1 = new Vector2(r.x,r.y);
        
        Canvas.Line(v0,v1,inColour, width);
    }

    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        let r = new Rect();

        r.set(inPos.x,inPos.y,inSize,inSize);
        r = this.toScreenSpace(r);

        Canvas.Text(r.h, inString, new Vector2(r.x,r.y),inColour,inJustification,font);
    }

    Rect(inRect,inColour)
    {
        Canvas.Rect(this.toScreenSpace(inRect), inColour);
    }
    
    drawLetterbox(colour)
    {
        let rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));
        
        if(rect.x > 0)
        {
            //left + right letterbox
            
            Canvas.Rect(new Rect(0,0,rect.x,rect.h),colour);
            Canvas.Rect(new Rect(rect.x+rect.w,0,this.currentScreenSize.w-(rect.x+rect.w),rect.h),colour);
            
        }
        //else
        {
            //top + bottom
            Canvas.Rect(new Rect(0,0,rect.w,rect.y),colour);
            Canvas.Rect(new Rect(0,rect.h+(this.offset.y/2),rect.w,this.currentScreenSize.h - rect.h+(this.offset.y/2)),colour);
        }
    }
    
    Sprite(image,inRect,uvRect)
    {
        let rect = this.toScreenSpace(inRect);
        Canvas.Sprite(image,rect,uvRect);
    }
}

GAZCanvas = new gazcanvas();

