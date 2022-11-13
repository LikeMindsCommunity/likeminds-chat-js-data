import { NgModule } from "@angular/core";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
    imports: [
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot()
    ],
    exports: [
        BsDatepickerModule,
        TooltipModule
    ]
})

export class BsModule { }