import { Pipe, PipeTransform } from "@angular/core";

declare var window: any;

@Pipe({
    name: 'defaultImage'
})

export class DefaultImagePipe implements PipeTransform {
    
    transform(url: string, name: string) {
        let screenWidth = window && window.innerWidth;
        if (url) return url;
        if (!url && !name) return `assets/images/svg/profile-img-bg-${screenWidth <= 425 ? 'white' : 'gray'}.svg`;
        // if (!url && name) return this.getNameCanvas(name);
    }

    getNameCanvas(name: string) {
        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = 32;
        canvas.height = 32;
        document.body.appendChild(canvas);
        var context = canvas.getContext('2d');
        context.fillStyle = "#999";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = "16px Arial";
        context.fillStyle = "#ccc";
        let nameArr = name.split(' ');
        let firstName = nameArr[0];
        let lastName = nameArr[nameArr.length];
        if (firstName) {
            if (lastName) {
                var initials = firstName + lastName;
                context.fillText(initials.toUpperCase(), 3, 23);
            } else {
                var initials = firstName;
                context.fillText(initials.toUpperCase(), 10, 23);
            }
            var data = canvas.toDataURL();
            document.body.removeChild(canvas);
            return data;
        }
    }
}