(function($) {

    var CarregaDados = {
            carregar : function() {
                $.getJSON('/query', function(resultado) {
                    var todosProjetos = resultado.value;
                    CarregaDados.carregarIndicadores(todosProjetos[0].indicadores);
                    var ulProjetos = $('<ul id="lista-projetos" />');
                    CarregaDados.adicionaProjetos(ulProjetos, todosProjetos);
                    $("#data").html(ulProjetos);
                    CarregaDados.defineCliqueEmIndicador(todosProjetos);
                });
            },

            defineCliqueEmIndicador : function (todosProjetos) {

                 $(".opener").each(function() {
                    $(this).click(function() {

                        var split = $(this).data("idpma").split("_");
                        idIndicador = split[1];
                        idProjeto = split[2];

                        for (var i = 0; i < todosProjetos.length; i++) {
                            var projeto = todosProjetos[i];
                            if (idProjeto == projeto.idPma) {
                                break;
                            }
                        }

                        for (i = 0; i < projeto.indicadores.length; i++) {
                            var indicador = projeto.indicadores[i];
                            if (indicador.id == idIndicador) {
                                break;
                            }
                        }
                        $("#dialog").dialog("open");
                        CarregaDados.populaDiv(projeto, indicador);
                    });
                });

            },

            adicionaProjetos : function (container, value) {
                var projetos = value;
                $.each(projetos, function(key, val) {
                    if (val.nome.length >= 14){
                        var nome = val.nome.substring(0,10)+"...";
                    }
                    else{
                        var nome = val.nome;
                    }
                    var liProjeto = $('<li id="' + val.idPma + '" />');
                    liProjeto.html('<h4 class="projeto-' + val.classificacao + '">'+nome+'</h4>');
                    container.append(liProjeto);
                    CarregaDados.adicionaIndicadores(liProjeto, val);
                });
            },

            adicionaIndicadores : function (container, projeto) {

                var ulIndicadores = $('<ul id="' + projeto.idPma + '_indicadores" class="indicadores" />');
                var indicadores = projeto.indicadores;

                $.each(indicadores, function(key, val) {
                    var id = "indicador_" + val.id + "_" + projeto.idPma;
                    var liIndicador = $('<li data-idpma=' + id + ' class="' + val.classificacao + ' permiteAlteracao opener" id="'+ id +'">&nbsp;</li>');
                    if (val.nome == "CPI") {
                        liIndicador.html(projeto.cpi);
                    }
                    ulIndicadores.append(liIndicador);
                });

                container.append(ulIndicadores);
            },

            populaDiv : function (projeto, indicador){

                $("#edicaoIndicadorNomeProjeto").html(projeto.nome);
                $("#edicaoIndicadorNomeIndicador").html(indicador.nome);
                $("#edicaoIndicadorNomeIndicador").html(indicador.usuarioUltimaAlteracao + " em " + indicador.ultimaAlteracaoString);
                $("#edicaoIndicadorTxtDescricao").val(indicador.descricao);

                $("#botaoDeTroca").unbind('click');
                $("#botaoDeTroca").click(function() {
                    CarregaDados.trocaIndicador(projeto.idPma, indicador);
                });

            },

            trocaIndicador : function(idProjeto, indicador){

            	indicador.descricao = $("#edicaoIndicadorTxtDescricao").val();
                indicador.classificacao = $("#classificacaoIndicador").val();

                $.ajax({
                    type: "POST",
                    url: "/indicador",
                    data: {
                        projeto: idProjeto,
                        indicador: JSON.stringify(indicador)
                    },
                    complete : function() {
                        CarregaDados.carregar();
                    }
                });
                $("#dialog").dialog("close");

            },

            carregarIndicadores : function (indicadores) {
                var ul = $("#menuIndicadores");
                ul.html('');
                $.each(indicadores, function(key, val){
                   var li = '<li>' + val.nome +'</li>';
                   ul.append(li);

                });
            }
    }


    $(window).ready(function() {
        $("#dialog").dialog({
            autoOpen : false,
            show : {
                effect : "blind",
                duration : 400
            },
            hide : {
                effect : "explode",
                duration : 400
            },
            width : 550,
            height : 290
        });


        CarregaDados.carregar();
    });

})(jQuery);