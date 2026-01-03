import { Component, computed } from '@angular/core';
import { LoaderService } from '../../../core/services/shared/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  constructor(private loaderService: LoaderService) { }

  loading = computed(() => this.loaderService.isLoading());
}
